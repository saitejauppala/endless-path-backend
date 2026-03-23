import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/bookings', adminController.getAllBookings);
router.get('/providers', adminController.getAllProviders);
router.patch('/providers/:id/approve', adminController.approveProvider);

export default router;
