import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Contact from '../models/Contact.js';
import mongoose from 'mongoose';
import sendNotification from '../services/notificationService.js';

const createSale = asyncHandler(async (req, res) => {
  const { items, customerId, subtotal, discount, total, paymentMethod, paymentDetails } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('ไม่มีรายการสินค้าในการขาย');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`ไม่พบสินค้า: ${item.name}`);
      }
      const quantityToDeduct = item.qty * (product.units.find(u => u.name === item.unitName)?.conversionRate || 1);
      if (product.productType === 'standard') {
        if (product.quantity < quantityToDeduct) {
          throw new Error(`สินค้า '${product.name}' มีไม่พอ (เหลือ ${product.quantity} ${product.units[0].name})`);
        }
        product.quantity -= quantityToDeduct;
        await product.save({ session });
        if (product.quantity <= product.lowStockThreshold && product.lowStockThreshold > 0) {
          const message = `⚠️ สินค้าใกล้หมด! '${product.name}' เหลือเพียง ${product.quantity} ${product.units[0].name || 'ชิ้น'}`;
          await sendNotification(message);
        }
      } else if (product.productType === 'bundle') {
        for (const bundledItem of product.bundledItems) {
            const subProduct = await Product.findById(bundledItem.product).session(session);
            if (!subProduct) throw new Error(`ไม่พบสินค้าส่วนประกอบในเซ็ต: ${bundledItem.product}`);
            const subProductQtyToDeduct = bundledItem.quantity * item.qty;
            if(subProduct.quantity < subProductQtyToDeduct) {
                throw new Error(`สินค้าส่วนประกอบ '${subProduct.name}' ในเซ็ต '${product.name}' มีไม่พอ`);
            }
            subProduct.quantity -= subProductQtyToDeduct;
            await subProduct.save({session});
            if (subProduct.quantity <= subProduct.lowStockThreshold && subProduct.lowStockThreshold > 0) {
              const message = `⚠️ สินค้า(ในเซ็ต)ใกล้หมด! '${subProduct.name}' เหลือเพียง ${subProduct.quantity} ${subProduct.units[0].name || 'ชิ้น'}`;
              await sendNotification(message);
            }
        }
      }
    }

    let customer = null;
    if (customerId) {
        customer = await Contact.findById(customerId).session(session);
        if (!customer) throw new Error('ไม่พบข้อมูลลูกค้า');
    }

    const sale = new Sale({
      user: req.user._id,
      items: items.map(i => ({ product: i.productId, name: i.name, qty: i.qty, price: i.price })),
      customer: customerId,
      subtotal,
      discount,
      total,
      paymentMethod,
    });
    
    if (paymentMethod === 'ขายเชื่อ') {
        sale.paymentStatus = 'unpaid';
        sale.amountPaid = 0;
        sale.dueDate = paymentDetails.dueDate;
        if(customer) {
            customer.currentBalance = (customer.currentBalance || 0) + total;
            await customer.save({ session });
        }
    } else {
        sale.paymentStatus = 'paid';
        sale.amountPaid = total;
        sale.paidAt = new Date();
        sale.payments.push({
            amount: total,
            method: paymentMethod,
            date: new Date()
        });
    }

    const createdSale = await sale.save({ session });
    await session.commitTransaction();
    
    // --- Send Notification for New Sale ---
    const customerName = customer ? customer.name : "ลูกค้าทั่วไป";
    const saleMessage = `💸 สร้างรายการขายใหม่ #${createdSale.receiptNumber}\nลูกค้า: ${customerName}\nยอดรวม: ${total.toLocaleString()} บาท\nสถานะ: ${sale.paymentStatus}`;
    await sendNotification(saleMessage);
    // ------------------------------------
    
    res.status(201).json(createdSale);

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

const addPaymentToSale = asyncHandler(async (req, res) => {
    const { amount, method, notes } = req.body;
    const saleId = req.params.id;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const sale = await Sale.findById(saleId).session(session);
        if (!sale) {
            res.status(404);
            throw new Error('ไม่พบรายการขาย');
        }

        const paymentAmount = Number(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            res.status(400);
            throw new Error('จำนวนเงินไม่ถูกต้อง');
        }

        sale.payments.push({ amount: paymentAmount, method, notes, date: new Date() });
        sale.amountPaid += paymentAmount;
        
        const updatedSale = await sale.save({ session });
        
        if (sale.customer) {
            await Contact.findByIdAndUpdate(sale.customer, { $inc: { currentBalance: -paymentAmount } }).session(session);
        }

        await session.commitTransaction();

        // --- Send Notification for Payment ---
        const populatedSale = await Sale.findById(updatedSale._id).populate('customer', 'name');
        const paymentMessage = `✅ รับชำระเงิน\nบิล #${populatedSale.receiptNumber}\nลูกค้า: ${populatedSale.customer.name}\nรับเงิน: ${paymentAmount.toLocaleString()} บาท\nยอดคงเหลือ: ${populatedSale.balance.toLocaleString()} บาท`;
        await sendNotification(paymentMessage);
        // ------------------------------------

        res.json(updatedSale);
    } catch(error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

const getSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find({}).populate('customer', 'name currentBalance').populate('user', 'name').sort({ createdAt: -1 });
    res.json(sales);
});

const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate('user', 'name email').populate('customer');
  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error('Sale not found');
  }
});

export { createSale, getSales, getSaleById, addPaymentToSale };