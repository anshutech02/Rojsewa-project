import Service from '../models/Service.js';
import Provider from '../models/Provider.js';

// @desc    Get all services / Search / Filter
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, rating, isEmergency, city } = req.query;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (isEmergency) {
      query.isEmergency = isEmergency === 'true';
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Find services
    console.log('Querying services with:', query);
    let services = await Service.find(query)
      .populate({
        path: 'provider',
        populate: { 
          path: 'user', 
          select: 'name email phone avatar address' 
        }
      })
      .populate('category');

    // Filter by provider criteria if needed (rating, city)
    if (rating || city) {
      services = services.filter((service) => {
        if (!service.provider) return false;
        
        if (rating && service.provider.rating < Number(rating)) {
          return false;
        }

        if (city && service.provider.serviceArea?.city?.toLowerCase() !== city.toLowerCase()) {
          return false;
        }

        return true;
      });
    }
    
    res.status(200).json({ success: true, count: services.length, services: services });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone avatar address' }
      })
      .populate('category');

    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    res.status(200).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Service
// @route   POST /api/services
// @access  Private/Provider
export const createService = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      res.status(403);
      return next(new Error('Only registered providers can create services'));
    }

    if (!provider.isApproved) {
      res.status(403);
      return next(new Error('Your provider account is pending approval'));
    }

    const { category, title, description, price, priceType, duration, images, tags, isEmergency } = req.body;

    const service = await Service.create({
      provider: provider._id,
      category,
      title,
      description,
      price,
      priceType,
      duration,
      images: images || [],
      tags: tags || [],
      isEmergency: isEmergency || false,
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Service
// @route   PUT /api/services/:id
// @access  Private/Provider
export const updateService = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      res.status(403);
      return next(new Error('Not authorized'));
    }

    let service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    // Make sure service belongs to provider
    if (service.provider.toString() !== provider._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this service'));
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Service
// @route   DELETE /api/services/:id
// @access  Private/Provider
export const deleteService = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      res.status(403);
      return next(new Error('Not authorized'));
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      return next(new Error('Service not found'));
    }

    // Make sure service belongs to provider
    if (service.provider.toString() !== provider._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to delete this service'));
    }

    await service.deleteOne();

    res.status(200).json({ success: true, message: 'Service removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Provider's Own Services
// @route   GET /api/services/provider/me
// @access  Private/Provider
export const getProviderServices = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      res.status(403);
      return next(new Error('Only registered providers can access this'));
    }

    const services = await Service.find({ provider: provider._id })
      .populate('category');

    res.status(200).json({ success: true, count: services.length, services });
  } catch (error) {
    next(error);
  }
};
