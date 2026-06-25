import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import Notification from '../models/Notification.js';
import { sendNotification } from '../socket/index.js';
import { sendBookingWhatsAppNotification } from '../utils/whatsappService.js';

// @desc    Create Booking
// @route   POST /api/bookings
// @access  Private/Customer
export const createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingType, scheduledDate, scheduledTime, address, notes, paymentMethod } = req.body;

    const service = await Service.findById(serviceId).populate('provider');
    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    if (!service.provider) {
      res.status(400);
      return next(new Error('Provider not found for this service'));
    }

    const providerId = service.provider._id;

    // Create booking
    const booking = await Booking.create({
      customer: req.user.id,
      provider: providerId,
      service: serviceId,
      bookingType: bookingType || 'instant',
      scheduledDate,
      scheduledTime,
      address,
      totalAmount: service.price,
      paymentMethod: paymentMethod || 'cash',
      notes,
      statusHistory: [{ status: 'pending', note: 'Booking initiated by customer' }],
    });

    // Create notification for provider
    const providerUser = service.provider.user; // populated user ID or object
    const notification = await Notification.create({
      user: providerUser,
      type: 'booking',
      title: 'New Booking Request',
      message: `You have received a new booking request for ${service.title}.`,
      data: { bookingId: booking._id },
    });

    // Emit live socket event to provider if connected
    const io = req.app.get('io');
    sendNotification(io, providerUser.toString(), 'notification:new', notification);
    sendNotification(io, providerUser.toString(), 'provider:newBooking', booking);

    // Send WhatsApp notifications asynchronously after populating necessary fields
    // await booking.populate([
    //   { path: 'customer' },
    //   { path: 'provider', populate: { path: 'user' } },
    //   { path: 'service' }
    // ]);
    // sendBookingWhatsAppNotification(booking, 'created');
    // sendBookingWhatsAppNotification(booking, 'new_request');
    console.log('Booking created and notifications sent successfully.');

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Bookings (filtered by role)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ user: req.user.id });
      if (!provider) {
        res.status(404);
        return next(new Error('Provider profile not found'));
      }
      query.provider = provider._id;
    } else if (req.user.role === 'admin') {
      // Admin sees everything, optionally filter
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone avatar')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate('service')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Booking Detail
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone avatar')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate('service');

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Check authorization: must be customer, provider, or admin of the booking
    const isCustomer = booking.customer._id.toString() === req.user.id;
    const isProvider = booking.provider.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      res.status(403);
      return next(new Error('Not authorized to view this booking'));
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel Booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('service');

    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Auth check
    const isCustomer = booking.customer.toString() === req.user.id;
    
    // Resolve provider user ID
    const providerObj = await Provider.findById(booking.provider);
    const isProvider = providerObj && providerObj.user.toString() === req.user.id;

    if (!isCustomer && !isProvider && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to cancel this booking'));
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      res.status(400);
      return next(new Error(`Cannot cancel a booking that is already ${booking.status}`));
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason || 'Cancelled by user';
    booking.statusHistory.push({ status: 'cancelled', note: booking.cancellationReason });
    await booking.save();

    // Notify other party
    const notifyUserId = isCustomer ? providerObj.user : booking.customer;
    const notification = await Notification.create({
      user: notifyUserId,
      type: 'booking',
      title: 'Booking Cancelled',
      message: `Booking for service ${booking.service.title} has been cancelled.`,
      data: { bookingId: booking._id },
    });

    const io = req.app.get('io');
    sendNotification(io, notifyUserId.toString(), 'notification:new', notification);
    sendNotification(io, notifyUserId.toString(), 'booking:statusUpdate', booking);

    // Send WhatsApp notification
    let cancelledBy = 'user';
    if (isCustomer) {
      cancelledBy = 'customer';
    } else if (isProvider) {
      cancelledBy = 'provider';
    } else if (req.user.role === 'admin') {
      cancelledBy = 'administrator';
    }

    await booking.populate([
      { path: 'customer' },
      { path: 'provider', populate: { path: 'user' } }
    ]);
    sendBookingWhatsAppNotification(booking, 'cancelled', {
      cancellationReason: booking.cancellationReason,
      cancelledBy
    });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Booking Status (Accept / Reject / Start / Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private/Provider
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    
    if (!['accepted', 'rejected', 'in_progress', 'completed'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid status update request'));
    }

    const booking = await Booking.findById(req.params.id).populate('service');
    if (!booking) {
      res.status(404);
      return next(new Error('Booking not found'));
    }

    // Check if provider owns the booking
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider || booking.provider.toString() !== provider._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to manage this booking'));
    }

    booking.status = status;
    booking.statusHistory.push({ status, note: note || `Status updated to ${status}` });

    if (status === 'completed') {
      booking.completedAt = Date.now();
      booking.paymentStatus = 'paid';
      // Add earnings to provider
      provider.completedBookings += 1;
      provider.totalEarnings += booking.totalAmount;
      await provider.save();
    }

    await booking.save();

    // Notify customer
    const notification = await Notification.create({
      user: booking.customer,
      type: 'booking',
      title: `Booking ${status.replace('_', ' ')}`,
      message: `Your booking for ${booking.service.title} is now ${status.replace('_', ' ')}.`,
      data: { bookingId: booking._id },
    });

    const io = req.app.get('io');
    sendNotification(io, booking.customer.toString(), 'notification:new', notification);
    sendNotification(io, booking.customer.toString(), 'booking:statusUpdate', booking);

    // Send WhatsApp notification
    await booking.populate([
      { path: 'customer' },
      { path: 'provider', populate: { path: 'user' } }
    ]);
    sendBookingWhatsAppNotification(booking, status);

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};
