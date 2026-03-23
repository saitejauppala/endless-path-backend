import { Review, Booking, Provider } from '../../models';
import { AppError } from '../../utils/AppError';

export interface CreateReviewInput {
  bookingId: string;
  customerId: string;
  rating: number;
  comment?: string;
}

/**
 * Create a review for a completed booking.
 * Only the customer who made the booking can review it.
 */
export const createReview = async (input: CreateReviewInput) => {
  // Fetch the booking
  const booking = await Booking.findByPk(input.bookingId);
  if (!booking) throw new AppError('Booking not found.', 404);

  // Must be the booking's customer
  if (booking.customerId !== input.customerId) throw new AppError('Access denied.', 403);

  // Can only review completed bookings
  if (booking.status !== 'completed') throw new AppError('Can only review completed bookings.', 400);

  // Can't review twice
  const existing = await Review.findOne({ where: { bookingId: input.bookingId } });
  if (existing) throw new AppError('You have already reviewed this booking.', 409);

  if (!booking.providerId) throw new AppError('No provider assigned to this booking.', 400);

  const review = await Review.create({
    bookingId: input.bookingId,
    customerId: input.customerId,
    providerId: booking.providerId,
    rating: input.rating,
    comment: input.comment,
  });

  // Update provider's aggregate rating
  const allReviews = await Review.findAll({ where: { providerId: booking.providerId } });
  const avg = allReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / allReviews.length;

  await Provider.update(
    { averageRating: parseFloat(avg.toFixed(2)), totalReviews: allReviews.length },
    { where: { id: booking.providerId } }
  );

  return review;
};

/**
 * Get all reviews for a specific provider.
 */
export const getReviewsByProvider = async (providerId: string) => {
  return Review.findAll({
    where: { providerId },
    order: [['createdAt', 'DESC']],
  });
};
