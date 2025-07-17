import express from 'express';
const router = express.Router();
import { getPublicProducts, createCustomerOrder } from '../controllers/publicController.js';

router.route('/products').get(getPublicProducts);
router.route('/orders').post(createCustomerOrder);

export default router;