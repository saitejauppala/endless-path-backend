import { Router } from 'express';
import { body } from 'express-validator';
import * as reviewController from './review.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

// POST /api/reviews  (customer only)
router.post(
  '/',
  authenticate,
  authorize('customer'),
  [
    body('bookingId').notEmpty().withMessage('bookingId is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ],
  validate,
  reviewController.createReview
);

// GET /api/reviews/provider/:providerId
router.get('/provider/:providerId', reviewController.getReviewsByProvider);

export default router;
