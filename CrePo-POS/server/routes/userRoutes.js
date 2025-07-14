import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
// หมายเหตุ: หากต้องการให้เฉพาะ Admin จัดการผู้ใช้ ให้เพิ่ม ", admin" หลัง protect
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, getUsers);
router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, deleteUser)
  .get(protect, getUserById)
  .put(protect, updateUser);

export default router;
