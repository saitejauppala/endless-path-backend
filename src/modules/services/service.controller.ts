import { Request, Response, NextFunction } from 'express';
import * as serviceService from './service.service';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

/**
 * GET /api/services?category=Plumbing
 */
export const getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;
    const services = await serviceService.getAllServices(category as string | undefined);
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/services/:id
 */
export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await serviceService.getServiceById(req.params['id'] as string);
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/services  (admin only)
 */
export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let imageUrl: string | undefined;

    // If image file was uploaded via multer, push to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'services');
    }

    const service = await serviceService.createService({ ...req.body, imageUrl });
    res.status(201).json({ success: true, message: 'Service created', data: service });
  } catch (err) {
    next(err);
  }
};
