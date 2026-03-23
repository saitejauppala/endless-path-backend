import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingAttributes {
  id: string;
  customerId: string;       // FK -> users.id
  providerId?: string;      // FK -> providers.id (assigned after creation)
  serviceId: string;        // FK -> services.id
  status: BookingStatus;
  address: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  imageUrl?: string;        // optional job photo uploaded by customer
  scheduledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingCreationAttributes
  extends Optional<BookingAttributes, 'id' | 'providerId' | 'latitude' | 'longitude' | 'notes' | 'imageUrl' | 'scheduledAt' | 'status'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public customerId!: string;
  public providerId?: string;
  public serviceId!: string;
  public status!: BookingStatus;
  public address!: string;
  public latitude?: number;
  public longitude?: number;
  public notes?: string;
  public imageUrl?: string;
  public scheduledAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'providers', key: 'id' },
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'services', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    modelName: 'Booking',
  }
);

export default Booking;
