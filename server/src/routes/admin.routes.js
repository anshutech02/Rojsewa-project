import express from 'express';
import {
  getAdminDashboard,
  approveProvider,
  suspendProvider,
  getUsers,
  getProviders,
  getAdminBookings,
  getAdminServices,
  adminToggleService,
  adminRemoveService,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.put('/providers/:id/approve', approveProvider);
router.put('/providers/:id/suspend', suspendProvider);
router.get('/users', getUsers);
router.get('/providers', getProviders);
router.get('/bookings', getAdminBookings);
router.get('/services', getAdminServices);
router.put('/services/:id/toggle', adminToggleService);
router.delete('/services/:id', adminRemoveService);

export default router;
