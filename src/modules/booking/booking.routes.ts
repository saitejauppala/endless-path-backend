import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import * as bookingController from './booking.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/bookings — customer creates a booking
router.post(
  '/',
  authenticate,
  authorize('customer'),
  upload.single('image'),
  [
    body('serviceId').notEmpty().withMessage('serviceId is required'),
    body('address').notEmpty().withMessage('address is required'),
    body('status')
      .optional()
      .isIn(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']),
  ],
  validate,
  bookingController.createBooking
);

// GET /api/bookings/my — customer: view own bookings
router.get('/my', authenticate, authorize('customer'), bookingController.getMyBookings);

// GET /api/bookings/jobs — provider: view assigned jobs
router.get('/jobs', authenticate, authorize('provider'), bookingController.getMyJobs);

// GET /api/bookings/:id — get any booking detail (authenticated)
router.get('/:id', authenticate, bookingController.getBookingById);

// PATCH /api/bookings/:id/status — update booking status
router.patch(
  '/:id/status',
  authenticate,
  authorize('customer', 'provider', 'admin'),
  [
    body('status')
      .isIn(['pending', 'accepted', 'in_progress', 'completed', 'cancelled'])
      .withMessage('Invalid status value'),
  ],
  validate,
  bookingController.updateStatus
);

export default router;
