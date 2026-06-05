import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import { sendNotification } from '../socket/index.js';

// @desc    Get Admin Dashboard Stats & Overview
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalProviders = await Provider.countDocuments();

    // Provider status breakdown
    const pendingProvidersCount = await Provider.countDocuments({ status: 'pending' });
    const approvedProvidersCount = await Provider.countDocuments({ status: 'approved' });
    const rejectedProvidersCount = await Provider.countDocuments({ status: 'rejected' });
    const suspendedProvidersCount = await Provider.countDocuments({ status: 'suspended' });

    // Booking status breakdown
    const totalBookings = await Booking.countDocuments();
    const pendingBookingsCount = await Booking.countDocuments({ status: 'pending' });
    const activeBookingsCount = await Booking.countDocuments({ status: { $in: ['accepted', 'in_progress'] } });
    const completedBookingsCount = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookingsCount = await Booking.countDocuments({ status: 'cancelled' });

    // Services count
    const totalServices = await Service.countDocuments();

    // Calculate total revenue from completed bookings
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
        totalAdmins,
        totalProviders,
        pendingProviders: pendingProvidersCount,
        approvedProviders: approvedProvidersCount,
        rejectedProviders: rejectedProvidersCount,
        suspendedProviders: suspendedProvidersCount,
        totalBookings,
        pendingBookings: pendingBookingsCount,
        activeBookings: activeBookingsCount,
        completedBookings: completedBookingsCount,
        cancelledBookings: cancelledBookingsCount,
        totalServices,
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

    // Create notification for the provider user
    const title = status === 'approved' ? 'Application Approved!' : 'Application Rejected';
    const message = status === 'approved'
      ? 'Congratulations! Your service provider profile is approved. You can now access your dashboard and publish services.'
      : 'Unfortunately, your service provider profile has been rejected. Please review our terms or contact support for help.';

    const notification = await Notification.create({
      user: provider.user._id || provider.user,
      type: 'provider',
      title,
      message,
      data: { providerId: provider._id, status }
    });

    // Emit live socket event
    const io = req.app.get('io');
    sendNotification(io, (provider.user._id || provider.user).toString(), 'notification:new', notification);

    res.status(200).json({ success: true, message: `Provider status updated to ${status}`, provider });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend or Unsuspend Provider
// @route   PUT /api/admin/providers/:id/suspend
// @access  Private/Admin
export const suspendProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      res.status(404);
      return next(new Error('Provider not found'));
    }

    if (provider.status === 'suspended') {
      provider.status = 'approved';
      provider.isApproved = true;
    } else {
      provider.status = 'suspended';
      provider.isApproved = false;
    }

    await provider.save();

    // Create notification for the provider user
    const isSuspended = provider.status === 'suspended';
    const title = isSuspended ? 'Account Suspended' : 'Account Re-Activated';
    const message = isSuspended
      ? 'Attention: Your service provider account has been suspended by an administrator. Please contact support.'
      : 'Good news: Your service provider account has been unsuspended/re-activated. You can now resume work.';

    const notification = await Notification.create({
      user: provider.user._id || provider.user,
      type: 'provider',
      title,
      message,
      data: { providerId: provider._id, status: provider.status }
    });

    // Emit live socket event
    const io = req.app.get('io');
    sendNotification(io, (provider.user._id || provider.user).toString(), 'notification:new', notification);

    res.status(200).json({
      success: true,
      message: `Provider status updated to ${provider.status}`,
      provider,
    });
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

// @desc    Get All Bookings (admin view)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAdminBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone avatar')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate('service', 'title price')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Services (admin view)
// @route   GET /api/admin/services
// @access  Private/Admin
export const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('category', 'name icon');

    res.status(200).json({ success: true, count: services.length, services });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Toggle Disable/Enable Service
// @route   PUT /api/admin/services/:id/toggle
// @access  Private/Admin
export const adminToggleService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? 'enabled' : 'disabled'}`,
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Remove Service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
export const adminRemoveService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    await service.deleteOne();

    res.status(200).json({ success: true, message: 'Service removed by admin' });
  } catch (error) {
    next(error);
  }
};
