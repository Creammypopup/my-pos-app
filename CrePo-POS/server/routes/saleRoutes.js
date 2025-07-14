import express from 'express';
const router = express.Router();
import {
  addSaleItems,
  getSaleById,
  updateSaleToPaid,
  getMySales,
  getSales,
} from '../controllers/saleController.js';
import { protect } from '../middleware/authMiddleware.js';
// หมายเหตุ: หากต้องการให้เฉพาะ Admin ดู Sales ทั้งหมด ให้เพิ่ม ", admin" หลัง protect
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addSaleItems).get(protect, getSales);
router.route('/mysales').get(protect, getMySales);
router.route('/:id').get(protect, getSaleById);
router.route('/:id/pay').put(protect, updateSaleToPaid);

export default router;
