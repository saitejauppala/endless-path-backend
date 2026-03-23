// Central place to import all models and define associations
import User from './User';
import Provider from './Provider';
import Service from './Service';
import Booking from './Booking';
import Review from './Review';
import ProviderService from './ProviderService';

// ── User → Provider (one-to-one) ──────────────────────────
User.hasOne(Provider, { foreignKey: 'userId', as: 'providerProfile' });
Provider.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ── Provider ↔ Service (many-to-many via provider_services) ─
Provider.belongsToMany(Service, {
  through: ProviderService,
  foreignKey: 'providerId',
  as: 'services',
});
Service.belongsToMany(Provider, {
  through: ProviderService,
  foreignKey: 'serviceId',
  as: 'providers',
});

// ── Booking relations ─────────────────────────────────────
// Customer (User) → Bookings
User.hasMany(Booking, { foreignKey: 'customerId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// Provider → Bookings
Provider.hasMany(Booking, { foreignKey: 'providerId', as: 'jobs' });
Booking.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });

// Service → Bookings
Service.hasMany(Booking, { foreignKey: 'serviceId', as: 'bookings' });
Booking.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

// ── Review relations ──────────────────────────────────────
Booking.hasOne(Review, { foreignKey: 'bookingId', as: 'review' });
Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

User.hasMany(Review, { foreignKey: 'customerId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

Provider.hasMany(Review, { foreignKey: 'providerId', as: 'receivedReviews' });
Review.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });

export { User, Provider, Service, Booking, Review, ProviderService };
