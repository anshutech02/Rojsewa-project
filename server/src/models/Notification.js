import mongoose from 'mongoose';
import { createModelProxy } from '../utils/modelProxy.js';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'review', 'system', 'provider'],
    default: 'system',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = createModelProxy('Notification', notificationSchema);
export default Notification;
