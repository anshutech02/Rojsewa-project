import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { sendTokenResponse } from '../utils/token.js';
import jwt from 'jsonwebtoken';

// @desc    Register User (Customer or Provider)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, skills, bio, experience, serviceArea, availability } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email'));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'customer',
    });

    // If role is provider, create provider document
    if (user.role === 'provider') {
      await Provider.create({
        user: user._id,
        skills: skills || [],
        bio: bio || '',
        experience: experience || 0,
        serviceArea: serviceArea || { city: '', radius: 10 },
        availability: availability || { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], startTime: '09:00', endTime: '18:00' },
        status: 'pending',
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    // Get user and password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('refreshToken', 'none', {
      httpOnly: true,
      expires: new Date(Date.now() + 5000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401);
      return next(new Error('Refresh token not found'));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      return next(new Error('User not found'));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401);
    next(new Error('Invalid refresh token'));
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let providerData = null;

    if (user.role === 'provider') {
      providerData = await Provider.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      provider: providerData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      avatar: req.body.avatar,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    let providerData = null;
    if (user.role === 'provider') {
      const { skills, bio, experience, serviceArea, availability } = req.body;
      providerData = await Provider.findOneAndUpdate(
        { user: user._id },
        { skills, bio, experience, serviceArea, availability },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      user,
      provider: providerData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      return next(new Error('Incorrect current password'));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
