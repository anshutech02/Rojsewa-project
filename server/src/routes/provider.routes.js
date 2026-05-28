import express from 'express';
import {
  getProviderDashboard,
  getProviderProfile,
  updateProviderProfile,
} from '../controllers/provider.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('provider'));

router.get('/dashboard', getProviderDashboard);
router.route('/profile')
  .get(getProviderProfile)
  .put(updateProviderProfile);

export default router;
