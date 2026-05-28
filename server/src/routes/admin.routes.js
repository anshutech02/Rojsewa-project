import express from 'express';
import {
  getAdminDashboard,
  approveProvider,
  getUsers,
  getProviders,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.put('/providers/:id/approve', approveProvider);
router.get('/users', getUsers);
router.get('/providers', getProviders);

export default router;
