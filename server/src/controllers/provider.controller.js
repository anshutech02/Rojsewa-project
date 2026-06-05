import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Get Provider Dashboard Stats & Bookings
// @route   GET /api/provider/dashboard
// @access  Private/Provider
export const getProviderDashboard = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      res.status(404);
      return next(new Error('Provider profile not found'));
    }

    // Aggregations or simple counts
    const totalBookingsCount = await Booking.countDocuments({ provider: provider._id });
    const pendingCount = await Booking.countDocuments({ provider: provider._id, status: 'pending' });
    const activeCount = await Booking.countDocuments({ provider: provider._id, status: { $in: ['accepted', 'in_progress'] } });
    const completedCount = await Booking.countDocuments({ provider: provider._id, status: 'completed' });
    const totalServicesCount = await Service.countDocuments({ provider: provider._id });

    // Recent bookings
    const recentBookings = await Booking.find({ provider: provider._id })
      .populate('customer', 'name email phone avatar')
      .populate('service')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings: totalBookingsCount,
        pendingBookings: pendingCount,
        activeBookings: activeCount,
        completedBookings: completedCount,
        totalEarnings: provider.totalEarnings,
        rating: provider.rating,
        totalServices: totalServicesCount,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Provider Profile / Stats
// @route   GET /api/provider/profile
// @access  Private/Provider
export const getProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      res.status(404);
      return next(new Error('Provider profile not found'));
    }
    res.status(200).json({ success: true, provider });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Provider Profile
// @route   PUT /api/provider/profile
// @access  Private/Provider
export const updateProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!provider) {
      res.status(404);
      return next(new Error('Provider profile not found'));
    }

    res.status(200).json({ success: true, provider });
  } catch (error) {
    next(error);
  }
};
