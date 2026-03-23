import { Router } from 'express';
import * as providerController from './provider.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// POST /api/providers/register — provider registers their profile
router.post('/register', authenticate, authorize('provider'), providerController.registerProvider);

// GET /api/providers/me — provider views their own profile
router.get('/me', authenticate, authorize('provider'), providerController.getMyProfile);

// PATCH /api/providers/toggle-availability — go online/offline
router.patch('/toggle-availability', authenticate, authorize('provider'), providerController.toggleAvailability);

// GET /api/providers/:id — anyone can view a provider's public profile
router.get('/:id', authenticate, providerController.getProviderById);

export default router;
