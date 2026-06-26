import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), upload.single('image'), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, authorize('admin'), upload.single('image'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
