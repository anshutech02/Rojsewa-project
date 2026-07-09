import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { categoryUpload } from '../middleware/multer.middleware.js';

const router = express.Router();

const categoryFields = categoryUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 },
]);

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), categoryFields, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, authorize('admin'), categoryFields, updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
