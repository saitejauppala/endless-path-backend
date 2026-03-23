import { Booking, User, Provider, Service } from '../../models';
import { AppError } from '../../utils/AppError';
import { BookingStatus } from '../../models/Booking';

export interface CreateBookingInput {
  customerId: string;
  serviceId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  imageUrl?: string;
  scheduledAt?: Date;
}

/**
 * Create a booking and auto-assign the first available, approved provider
 * that offers the requested service.
 */
export const createBooking = async (input: CreateBookingInput) => {
  // Find the first available & approved provider for this service
  const provider = await Provider.findOne({
    where: { isAvailable: true, isApproved: true },
    include: [
      {
        model: Service,
        as: 'services',
        where: { id: input.serviceId },
        required: true,
      },
    ],
  });

  const booking = await Booking.create({
    ...input,
    providerId: provider ? provider.id : undefined,
    status: 'pending',
  });

  return booking;
};

/**
 * Get all bookings for a customer.
 */
export const getBookingsByCustomer = async (customerId: string) => {
  return Booking.findAll({
    where: { customerId },
    include: [
      { model: Provider, as: 'provider' },
      { model: Service, as: 'service' },
    ],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Get all jobs assigned to a provider.
 */
export const getJobsByProvider = async (providerId: string) => {
  return Booking.findAll({
    where: { providerId },
    include: [
      { model: User, as: 'customer', attributes: { exclude: ['password'] } },
      { model: Service, as: 'service' },
    ],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Update booking status (with permission checks).
 */
export const updateBookingStatus = async (
  bookingId: string,
  newStatus: BookingStatus,
  requesterId: string,
  requesterRole: string
) => {
  const booking = await Booking.findByPk(bookingId, {
    include: [{ model: Provider, as: 'provider' }],
  });
  if (!booking) throw new AppError('Booking not found.', 404);

  // Customers can only cancel their own bookings
  if (requesterRole === 'customer') {
    if (booking.customerId !== requesterId) throw new AppError('Access denied.', 403);
    if (newStatus !== 'cancelled') throw new AppError('Customers can only cancel bookings.', 400);
  }

  // Providers can accept, start, or complete their own jobs
  if (requesterRole === 'provider') {
    const providerRecord = await Provider.findOne({ where: { userId: requesterId } });
    if (!providerRecord || booking.providerId !== providerRecord.id) {
      throw new AppError('Access denied.', 403);
    }
  }

  booking.status = newStatus;
  await booking.save();
  return booking;
};

/**
 * Get a single booking by id.
 */
export const getBookingById = async (id: string) => {
  const booking = await Booking.findByPk(id, {
    include: [
      { model: User, as: 'customer', attributes: { exclude: ['password'] } },
      { model: Provider, as: 'provider' },
      { model: Service, as: 'service' },
    ],
  });
  if (!booking) throw new AppError('Booking not found.', 404);
  return booking;
};
