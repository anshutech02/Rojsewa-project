import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getProviderServices,
} from '../controllers/service.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, authorize('provider'), createService);

router.get('/provider/me', protect, authorize('provider'), getProviderServices);

router.route('/:id')
  .get(getServiceById)
  .put(protect, authorize('provider'), updateService)
  .delete(protect, authorize('provider'), deleteService);

export default router;
