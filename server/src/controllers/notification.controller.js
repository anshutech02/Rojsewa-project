import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendNotification } from '../socket/index.js';

// @desc    Get logged-in user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(100);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      return next(new Error('Notification not found'));
    }

    // Auth check
    if (notification.user.toString() !== req.user.id) {
      res.status(403);
      return next(new Error('Not authorized to access this notification'));
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      return next(new Error('Notification not found'));
    }

    // Auth check
    if (notification.user.toString() !== req.user.id) {
      res.status(403);
      return next(new Error('Not authorized to access this notification'));
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create and broadcast system notification to users
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
export const createAdminBroadcast = async (req, res, next) => {
  try {
    const { title, message, targetRole } = req.body;

    if (!title || !message) {
      res.status(400);
      return next(new Error('Please provide a title and a message'));
    }

    // Filter recipients based on role if targetRole is defined
    const query = {};
    if (targetRole && ['customer', 'provider', 'admin'].includes(targetRole)) {
      query.role = targetRole;
    }

    const users = await User.find(query);
    const notificationsData = users.map((user) => ({
      user: user._id,
      type: 'system',
      title,
      message,
      data: { sender: req.user.id, targetRole },
    }));

    // Batch insert notifications
    const createdNotifications = await Notification.insertMany(notificationsData);

    // Emit live socket event to any active rooms
    const io = req.app.get('io');
    createdNotifications.forEach((notification) => {
      sendNotification(io, notification.user.toString(), 'notification:new', notification);
    });

    res.status(201).json({
      success: true,
      message: `Broadcast message sent to ${users.length} users.`,
    });
  } catch (error) {
    next(error);
  }
};
