import express from 'express';
const router = express.Router();
import { getCustomerOrders, updateCustomerOrder } from '../controllers/customerOrderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getCustomerOrders);
router.route('/:id').put(protect, updateCustomerOrder);

export default router;