import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} from '../controllers/booking.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.route('/:id')
  .get(getBookingById);

router.route('/:id/cancel')
  .put(cancelBooking);

router.route('/:id/status')
  .put(authorize('provider', 'admin'), updateBookingStatus);

export default router;
