import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as reviewService from './review.service';

/**
 * POST /api/reviews  (customer only)
 */
export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await reviewService.createReview({
      bookingId: req.body.bookingId,
      customerId: req.user!.id,
      rating: parseInt(req.body.rating),
      comment: req.body.comment,
    });
    res.status(201).json({ success: true, message: 'Review submitted', data: review });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reviews/provider/:providerId
 */
export const getReviewsByProvider = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await reviewService.getReviewsByProvider(req.params['providerId'] as string);
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};
