import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import sendNotification from '../services/notificationService.js'; // <-- เพิ่มการนำเข้า

const createSale = asyncHandler(async (req, res) => {
  const { items, customer, subtotal, discount, total, paymentMethod } = req.body;

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

        // --- จุดที่เพิ่มการแจ้งเตือน ---
        if (product.quantity <= product.lowStockThreshold && product.lowStockThreshold > 0) {
          const message = `⚠️ สินค้าใกล้หมด! '${product.name}' เหลือเพียง ${product.quantity} ${product.units[0].name || 'ชิ้น'}`;
          sendNotification(message); // ส่งการแจ้งเตือน
        }
        // --- จบส่วนแจ้งเตือน ---

      } else if (product.productType === 'bundle') {
        for (const bundledItem of product.bundledItems) {
            const subProduct = await Product.findById(bundledItem.product).session(session);
            if (!subProduct) {
                throw new Error(`ไม่พบสินค้าส่วนประกอบในเซ็ต: ${bundledItem.product}`);
            }
            const subProductQtyToDeduct = bundledItem.quantity * item.qty;
            if(subProduct.quantity < subProductQtyToDeduct) {
                throw new Error(`สินค้าส่วนประกอบ '${subProduct.name}' ในเซ็ต '${product.name}' มีไม่พอ`);
            }
            subProduct.quantity -= subProductQtyToDeduct;
            await subProduct.save({session});

             // --- จุดที่เพิ่มการแจ้งเตือนสำหรับสินค้าในเซ็ต ---
            if (subProduct.quantity <= subProduct.lowStockThreshold && subProduct.lowStockThreshold > 0) {
              const message = `⚠️ สินค้า(ในเซ็ต)ใกล้หมด! '${subProduct.name}' เหลือเพียง ${subProduct.quantity} ${subProduct.units[0].name || 'ชิ้น'}`;
              sendNotification(message); // ส่งการแจ้งเตือน
            }
            // --- จบส่วนแจ้งเตือน ---
        }
      }
    }
    
    const sale = new Sale({
      user: req.user._id,
      items: items.map(i => ({ product: i.productId, name: i.name, qty: i.qty, price: i.price })),
      customer,
      subtotal,
      discount,
      total,
      paymentMethod,
    });

    const createdSale = await sale.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    const populatedSale = await Sale.findById(createdSale._id).populate('customer', 'name');
    res.status(201).json(populatedSale);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw new Error(error.message || 'ไม่สามารถบันทึกการขายได้');
  }
});

const getSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find({}).populate('user', 'name').populate('customer', 'name').sort({ createdAt: -1 });
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

export { createSale, getSales, getSaleById };