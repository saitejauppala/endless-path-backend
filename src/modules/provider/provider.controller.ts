import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as providerService from './provider.service';

/**
 * POST /api/providers/register
 */
export const registerProvider = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await providerService.registerProvider({
      userId: req.user!.id,
      bio: req.body.bio,
      experience: req.body.experience,
      serviceIds: req.body.serviceIds || [],
    });
    res.status(201).json({ success: true, message: 'Provider registered', data: provider });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/providers/me
 */
export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await providerService.getProviderByUserId(req.user!.id);
    res.json({ success: true, data: provider });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/providers/toggle-availability
 */
export const toggleAvailability = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await providerService.toggleAvailability(req.user!.id);
    res.json({
      success: true,
      message: `You are now ${provider.isAvailable ? 'online' : 'offline'}`,
      isAvailable: provider.isAvailable,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/providers/:id
 */
export const getProviderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await providerService.getProviderById(req.params['id'] as string);
    res.json({ success: true, data: provider });
  } catch (err) {
    next(err);
  }
};
