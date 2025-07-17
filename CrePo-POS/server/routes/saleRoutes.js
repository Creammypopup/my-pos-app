import express from 'express';
const router = express.Router();
import {
  createSale,
  getSales,
  getSaleById,
  addPaymentToSale, // <-- เพิ่ม
} from '../controllers/saleController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, createSale)
  .get(protect, getSales); 

router.route('/:id')
  .get(protect, getSaleById);

// --- Route ใหม่สำหรับรับชำระเงิน ---
router.route('/:id/payments').post(protect, addPaymentToSale);

export default router;