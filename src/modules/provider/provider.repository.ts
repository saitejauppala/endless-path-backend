import { Provider, User, Service, ProviderService } from '../../models';
import { AppError } from '../../utils/AppError';

export interface RegisterProviderInput {
  userId: string;
  bio?: string;
  experience?: number;
  serviceIds: string[]; // IDs of services the provider offers
}

/**
 * Register a provider profile for a user.
 */
export const registerProvider = async (input: RegisterProviderInput) => {
  // Check provider profile doesn't already exist
  const existing = await Provider.findOne({ where: { userId: input.userId } });
  if (existing) throw new AppError('Provider profile already exists.', 409);

  const provider = await Provider.create({
    userId: input.userId,
    bio: input.bio,
    experience: input.experience,
  });

  // Link services (many-to-many)
  if (input.serviceIds && input.serviceIds.length > 0) {
    const links = input.serviceIds.map((serviceId) => ({
      providerId: provider.id,
      serviceId,
    }));
    await ProviderService.bulkCreate(links);
  }

  return provider;
};

/**
 * Get full provider profile by userId.
 */
export const getProviderByUserId = async (userId: string) => {
  const provider = await Provider.findOne({
    where: { userId },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Service, as: 'services' },
    ],
  });
  if (!provider) throw new AppError('Provider profile not found.', 404);
  return provider;
};

/**
 * Toggle the provider's availability (online/offline).
 */
export const toggleAvailability = async (userId: string) => {
  const provider = await Provider.findOne({ where: { userId } });
  if (!provider) throw new AppError('Provider profile not found.', 404);

  provider.isAvailable = !provider.isAvailable;
  await provider.save();
  return provider;
};

/**
 * Get provider by their provider table id.
 */
export const getProviderById = async (id: string) => {
  const provider = await Provider.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Service, as: 'services' },
    ],
  });
  if (!provider) throw new AppError('Provider not found.', 404);
  return provider;
};
