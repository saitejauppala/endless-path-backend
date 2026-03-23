import * as providerRepo from './provider.repository';

export const registerProvider = (input: providerRepo.RegisterProviderInput) =>
  providerRepo.registerProvider(input);

export const getProviderByUserId = (userId: string) =>
  providerRepo.getProviderByUserId(userId);

export const toggleAvailability = (userId: string) =>
  providerRepo.toggleAvailability(userId);

export const getProviderById = (id: string) =>
  providerRepo.getProviderById(id);
