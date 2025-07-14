import express from 'express';
const router = express.Router();
import {
  getSettings,
  updateSettings,
} from '../controllers/settingController.js';
import { protect } from '../middleware/authMiddleware.js';
// หมายเหตุ: หากต้องการให้เฉพาะ Admin จัดการ Settings ให้เพิ่ม ", admin" หลัง protect
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getSettings).put(protect, updateSettings);

export default router;
