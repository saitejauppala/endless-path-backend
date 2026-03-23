import * as reviewRepo from './review.repository';

export const createReview = (input: reviewRepo.CreateReviewInput) =>
  reviewRepo.createReview(input);

export const getReviewsByProvider = (providerId: string) =>
  reviewRepo.getReviewsByProvider(providerId);
