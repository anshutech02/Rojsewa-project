import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createAdminBroadcast,
} from '../controllers/notification.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/read-all')
  .put(markAllAsRead);

router.route('/broadcast')
  .post(authorize('admin'), createAdminBroadcast);

router.route('/:id')
  .delete(deleteNotification);

router.route('/:id/read')
  .put(markAsRead);

export default router;
