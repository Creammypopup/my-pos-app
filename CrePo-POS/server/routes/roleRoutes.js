import express from 'express';
const router = express.Router();
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { protect } from '../middleware/authMiddleware.js';
// หมายเหตุ: ควรให้เฉพาะ Admin จัดการ Role
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getRoles).post(protect, createRole);
router
  .route('/:id')
  .get(protect, getRoleById)
  .put(protect, updateRole)
  .delete(protect, deleteRole);

export default router;
