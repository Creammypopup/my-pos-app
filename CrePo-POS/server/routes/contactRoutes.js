import express from 'express';
const router = express.Router();
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getContacts).post(protect, createContact);
router
  .route('/:id')
  .get(protect, getContactById)
  .put(protect, updateContact)
  .delete(protect, deleteContact);

export default router;
