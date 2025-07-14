import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
// หมายเหตุ: หากต้องการให้เฉพาะ Admin จัดการสินค้า ให้เพิ่ม ", admin" หลัง protect
// เช่น .delete(protect, admin, deleteProduct)

router.route('/').get(getProducts).post(protect, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct);

export default router;
