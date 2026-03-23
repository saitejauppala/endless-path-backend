import * as adminRepo from './admin.repository';

export const getAllUsers = () => adminRepo.getAllUsers();
export const getAllBookings = () => adminRepo.getAllBookings();
export const approveProvider = (providerId: string) => adminRepo.approveProvider(providerId);
export const getAllProviders = () => adminRepo.getAllProviders();
