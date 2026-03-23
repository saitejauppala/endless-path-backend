import { Service } from '../../models';
import { AppError } from '../../utils/AppError';

export interface CreateServiceInput {
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
}

/**
 * Fetch all active services, optionally filtered by category.
 */
export const getAllServices = async (category?: string) => {
  const where: any = { isActive: true };
  if (category) where.category = category;
  return Service.findAll({ where, order: [['name', 'ASC']] });
};

/**
 * Fetch a single service by id.
 */
export const getServiceById = async (id: string) => {
  const service = await Service.findByPk(id);
  if (!service) throw new AppError('Service not found.', 404);
  return service;
};

/**
 * Create a new service (admin action).
 */
export const createService = async (data: CreateServiceInput) => {
  return Service.create(data);
};
