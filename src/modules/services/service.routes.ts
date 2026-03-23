import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import * as serviceController from './service.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // files stored in memory buffer

// GET /api/services
router.get('/', serviceController.getAllServices);

// GET /api/services/:id
router.get('/:id', serviceController.getServiceById);

// POST /api/services  (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Service name is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  validate,
  serviceController.createService
);

export default router;
