import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('sortOrder');
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
    const { name, description, icon, image, parentCategory, sortOrder } = req.body;

    const category = await Category.create({
      name,
      description,
      icon,
      image,
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
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
