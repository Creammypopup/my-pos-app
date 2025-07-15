import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const { items, customer, subtotal, discount, total, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('ไม่มีรายการสินค้าในการขาย');
  }

  // Use a transaction to ensure atomicity
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`ไม่พบสินค้า: ${item.name}`);
      }
      if (product.quantity < item.qty) {
        throw new Error(`สินค้า '${product.name}' มีไม่พอ (เหลือ ${product.quantity} ${product.unit})`);
      }
      product.quantity -= item.qty;
      await product.save({ session });
    }
    
    const sale = new Sale({
      user: req.user._id,
      items,
      customer,
      subtotal,
      discount,
      total,
      paymentMethod,
    });

    const createdSale = await sale.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate customer details for the response
    const populatedSale = await Sale.findById(createdSale._id).populate('customer', 'name');

    res.status(201).json(populatedSale);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400); // Bad request for inventory issues or other errors
    throw new Error(error.message || 'ไม่สามารถบันทึกการขายได้');
  }
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find({}).populate('user', 'name').populate('customer', 'name');
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