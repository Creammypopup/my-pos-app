import express from 'express';
const router = express.Router();
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getEvents).post(protect, createEvent);
router
  .route('/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;
