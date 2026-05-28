import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments();
    const pendingProviders = await Provider.countDocuments({ status: 'pending' });
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue
    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Recent user signups
    const recentUsers = await User.find().sort('-createdAt').limit(5);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name' } })
      .populate('service', 'title')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalProviders,
        pendingProviders,
        totalBookings,
        totalRevenue,
      },
      recentUsers,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject Provider Registration
// @route   PUT /api/admin/providers/:id/approve
// @access  Private/Admin
export const approveProvider = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid status value'));
    }

    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      res.status(404);
      return next(new Error('Provider not found'));
    }

    provider.status = status;
    provider.isApproved = status === 'approved';
    await provider.save();

    res.status(200).json({ success: true, message: `Provider status updated to ${status}`, provider });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users (Customer/Provider/Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Providers
// @route   GET /api/admin/providers
// @access  Private/Admin
export const getProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find()
      .populate('user', 'name email phone avatar address')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: providers.length, providers });
  } catch (error) {
    next(error);
  }
};
