import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';

const addSaleItems = asyncHandler(async (req, res) => {
  const { saleItems, paymentMethod, itemsPrice, taxPrice, totalPrice } =
    req.body;

  if (!saleItems || saleItems.length === 0) {
    res.status(400);
    throw new Error('No sale items');
  }

  for (const item of saleItems) {
    const product = await Product.findById(item._id);
    if (!product) {
      res.status(404);
      throw new Error(`ไม่พบสินค้า: ${item.name}`);
    }
    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(
        `สินค้า ${product.name} มีไม่พอในสต็อก (เหลือเพียง ${product.countInStock} ชิ้น)`
      );
    }
  }

  const sale = new Sale({
    saleItems: saleItems.map((x) => ({
      name: x.name,
      qty: x.qty,
      price: x.price,
      image: x.image,
      product: x._id,
    })),
    user: req.user._id,
    paymentMethod,
    itemsPrice,
    taxPrice,
    totalPrice,
  });

  const createdSale = await sale.save();

  for (const item of createdSale.saleItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.qty;
      await product.save();
    }
  }

  res.status(201).json(createdSale);
});

const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate('user', 'name email');
  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error('Sale not found');
  }
});

const updateSaleToPaid = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (sale) {
    sale.isPaid = true;
    sale.paidAt = Date.now();
    sale.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedSale = await sale.save();
    res.json(updatedSale);
  } else {
    res.status(404);
    throw new Error('Sale not found');
  }
});

const getMySales = asyncHandler(async (req, res) => {
  const sales = await Sale.find({ user: req.user._id });
  res.json(sales);
});

const getSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find({}).populate('user', 'id name');
  res.json(sales);
});

export { addSaleItems, getSaleById, updateSaleToPaid, getMySales, getSales };
