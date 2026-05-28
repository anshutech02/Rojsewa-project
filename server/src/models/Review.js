import mongoose from 'mongoose';
import { createModelProxy } from '../utils/modelProxy.js';

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
    default: '',
  },
  images: [String],
}, {
  timestamps: true,
});

reviewSchema.index({ provider: 1, createdAt: -1 });
reviewSchema.index({ booking: 1 }, { unique: true });

const Review = createModelProxy('Review', reviewSchema);
export default Review;
