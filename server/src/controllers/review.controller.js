import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import Notification from '../models/Notification.js';
import { sendNotification } from '../socket/index.js';

// @desc    Create Review for completed Booking
// @route   POST /api/reviews
// @access  Private/Customer
export const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment, images } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Check authorization: only the customer who made the booking
    if (booking.customer.toString() !== req.user.id) {
      res.status(403);
      return next(new Error('Not authorized to review this booking'));
    }

    // Verify booking is completed
    if (booking.status !== 'completed') {
      res.status(400);
      return next(new Error('You can only review completed bookings'));
    }

    // Check if review already exists
    const reviewExists = await Review.findOne({ booking: bookingId });
    if (reviewExists) {
      res.status(400);
      return next(new Error('You have already reviewed this booking'));
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      customer: req.user.id,
      provider: booking.provider,
      rating,
      comment,
      images: images || [],
    });

    // Update provider ratings and total reviews
    const provider = await Provider.findById(booking.provider);
    if (provider) {
      const allReviews = await Review.find({ provider: provider._id });
      const totalReviews = allReviews.length;
      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

      provider.rating = averageRating;
      provider.totalReviews = totalReviews;
      await provider.save();
    }

    // Create notification for provider
    const providerUser = provider ? provider.user : null;
    if (providerUser) {
      const notification = await Notification.create({
        user: providerUser,
        type: 'review',
        title: 'New Review Received',
        message: `${req.user.name} rated your service: ${rating}/5 stars.`,
        data: { reviewId: review._id },
      });

      const io = req.app.get('io');
      sendNotification(io, providerUser.toString(), 'notification:new', notification);
    }

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Reviews for Provider
// @route   GET /api/reviews/provider/:id
// @access  Public
export const getProviderReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ provider: req.params.id })
      .populate('customer', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};
