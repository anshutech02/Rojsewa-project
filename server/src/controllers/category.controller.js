import Category from '../models/Category.js';
import {uploadSingleToCloudinary}  from '../utils/uploadToCloudinary.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.all !== 'true') {
      query.isActive = true;
    }
    const categories = await Category.find(query).sort('sortOrder');
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID/slug
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }]
    });

    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory, sortOrder } = req.body;

    const categoryData = {
      name,
      description,
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0,
    };

    // Handle main image upload
    if (req.files?.image?.[0]) {
      const imageResult = await uploadSingleToCloudinary(req.files.image[0].buffer);
      if (!imageResult) {
        res.status(400);
        return next(new Error('Image upload failed'));
      }
      categoryData.image = imageResult.secure_url;
    }

    // Handle background image upload
    if (req.files?.backgroundImage?.[0]) {
      const bgResult = await uploadSingleToCloudinary(req.files.backgroundImage[0].buffer);
      if (!bgResult) {
        res.status(400);
        return next(new Error('Background image upload failed'));
      }
      categoryData.backgroundImage = bgResult.secure_url;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // Handle main image upload
    if (req.files?.image?.[0]) {
      const imageResult = await uploadSingleToCloudinary(req.files.image[0].buffer);
      if (!imageResult) {
        res.status(400);
        return next(new Error('Image upload failed'));
      }
      updateData.image = imageResult.secure_url;
    }

    // Handle background image upload
    if (req.files?.backgroundImage?.[0]) {
      const bgResult = await uploadSingleToCloudinary(req.files.backgroundImage[0].buffer);
      if (!bgResult) {
        res.status(400);
        return next(new Error('Background image upload failed'));
      }
      updateData.backgroundImage = bgResult.secure_url;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after" ,
        runValidators: true
      }
    );

    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete Category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    res.status(200).json({ success: true, message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};
