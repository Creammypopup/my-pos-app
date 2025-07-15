import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ id: req.params.id, message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, description, quantity, lowStockThreshold, units, productType, bundledItems } = req.body;

    if (!units || units.length === 0) {
        res.status(400);
        throw new Error('สินค้าต้องมีอย่างน้อย 1 หน่วย');
    }

    const product = new Product({
      name,
      sku,
      category,
      description,
      quantity,
      lowStockThreshold,
      units,
      productType,
      bundledItems,
      user: req.user._id,
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, description, quantity, lowStockThreshold, units, productType, bundledItems } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name ?? product.name;
    product.sku = sku ?? product.sku;
    product.category = category ?? product.category;
    product.description = description ?? product.description;
    product.quantity = quantity ?? product.quantity;
    product.lowStockThreshold = lowStockThreshold ?? product.lowStockThreshold;
    product.units = units ?? product.units;
    product.productType = productType ?? product.productType;
    product.bundledItems = bundledItems ?? product.bundledItems;


    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};