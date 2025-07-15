import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ id: req.params.id, message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
    // รับข้อมูลจาก req.body ที่ตรงกับฟอร์ม
    const { name, sku, unit, cost, price, quantity, lowStockThreshold, category, description } = req.body;

    const product = new Product({
      name: name || 'Sample name',
      user: req.user._id,
      sku,
      unit: unit || 'ชิ้น',
      cost: cost || 0,
      price: price || 0,
      quantity: quantity || 0,
      lowStockThreshold: lowStockThreshold || 0,
      category: category || 'Sample category',
      description: description || 'Sample description',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
    const { name, sku, unit, cost, price, quantity, lowStockThreshold, category, description } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.unit = unit || product.unit;
    product.cost = cost === undefined ? product.cost : cost;
    product.price = price === undefined ? product.price : price;
    product.quantity = quantity === undefined ? product.quantity : quantity;
    product.lowStockThreshold = lowStockThreshold === undefined ? product.lowStockThreshold : lowStockThreshold;
    product.category = category || product.category;
    product.description = description || product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};