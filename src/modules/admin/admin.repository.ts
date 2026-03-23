import { User, Provider, Booking } from '../../models';
import { AppError } from '../../utils/AppError';

/**
 * Get all users (excluding passwords).
 */
export const getAllUsers = async () => {
  return User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
};

/**
 * Get all bookings with relations.
 */
export const getAllBookings = async () => {
  return Booking.findAll({
    include: [
      { model: User, as: 'customer', attributes: { exclude: ['password'] } },
      { model: Provider, as: 'provider' },
    ],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Approve a provider (allow them to receive bookings).
 */
export const approveProvider = async (providerId: string) => {
  const provider = await Provider.findByPk(providerId);
  if (!provider) throw new AppError('Provider not found.', 404);

  provider.isApproved = true;
  await provider.save();
  return provider;
};

/**
 * Get all providers (with their user info and approval status).
 */
export const getAllProviders = async () => {
  return Provider.findAll({
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
    order: [['createdAt', 'DESC']],
  });
};
