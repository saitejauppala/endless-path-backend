import * as serviceRepo from './service.repository';

export const getAllServices = (category?: string) =>
  serviceRepo.getAllServices(category);

export const getServiceById = (id: string) =>
  serviceRepo.getServiceById(id);

export const createService = (data: serviceRepo.CreateServiceInput) =>
  serviceRepo.createService(data);
