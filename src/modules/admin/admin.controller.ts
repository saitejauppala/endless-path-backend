import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as adminService from './admin.service';

/**
 * GET /api/admin/users
 */
export const getAllUsers = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/bookings
 */
export const getAllBookings = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await adminService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/providers
 */
export const getAllProviders = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const providers = await adminService.getAllProviders();
    res.json({ success: true, data: providers });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/providers/:id/approve
 */
export const approveProvider = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await adminService.approveProvider(req.params['id'] as string);
    res.json({ success: true, message: 'Provider approved', data: provider });
  } catch (err) {
    next(err);
  }
};
