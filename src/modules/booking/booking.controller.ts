import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as bookingService from './booking.service';
import { BookingStatus } from '../../models/Booking';

/**
 * POST /api/bookings  (customer only)
 */
export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await bookingService.createBooking({
      customerId: req.user!.id,
      serviceId: req.body.serviceId,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      notes: req.body.notes,
      scheduledAt: req.body.scheduledAt,
      imageBuffer: req.file?.buffer,
    });
    res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/my  (customer: my bookings)
 */
export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await bookingService.getBookingsByCustomer(req.user!.id);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/jobs  (provider: my assigned jobs)
 */
export const getMyJobs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { Provider } = await import('../../models');
    const providerRecord = await Provider.findOne({ where: { userId: req.user!.id } });
    if (!providerRecord) {
      res.status(404).json({ success: false, message: 'Provider profile not found' });
      return;
    }
    const jobs = await bookingService.getJobsByProvider(providerRecord.id);
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/bookings/:id
 */
export const getBookingById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await bookingService.getBookingById(req.params['id'] as string);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/bookings/:id/status
 */
export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await bookingService.updateBookingStatus(
      req.params['id'] as string,
      req.body.status as BookingStatus,
      req.user!.id,
      req.user!.role
    );
    res.json({ success: true, message: 'Status updated', data: booking });
  } catch (err) {
    next(err);
  }
};
