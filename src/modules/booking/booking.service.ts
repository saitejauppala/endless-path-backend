import * as bookingRepo from './booking.repository';
import { BookingStatus } from '../../models/Booking';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

export interface CreateBookingInput {
  customerId: string;
  serviceId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  scheduledAt?: Date;
  imageBuffer?: Buffer;
}

export const createBooking = async (input: CreateBookingInput) => {
  let imageUrl: string | undefined;
  if (input.imageBuffer) {
    imageUrl = await uploadToCloudinary(input.imageBuffer, 'bookings');
  }
  const { imageBuffer, ...rest } = input;
  return bookingRepo.createBooking({ ...rest, imageUrl });
};

export const getBookingsByCustomer = (customerId: string) =>
  bookingRepo.getBookingsByCustomer(customerId);

export const getJobsByProvider = (providerId: string) =>
  bookingRepo.getJobsByProvider(providerId);

export const updateBookingStatus = (
  bookingId: string,
  newStatus: BookingStatus,
  requesterId: string,
  requesterRole: string
) => bookingRepo.updateBookingStatus(bookingId, newStatus, requesterId, requesterRole);

export const getBookingById = (id: string) =>
  bookingRepo.getBookingById(id);
