import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ProviderAttributes {
  id: string;
  userId: string;           // FK -> users.id
  bio?: string;
  experience?: number;      // years of experience
  isAvailable: boolean;     // online / offline toggle
  isApproved: boolean;      // admin must approve
  averageRating: number;
  totalReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProviderCreationAttributes
  extends Optional<ProviderAttributes, 'id' | 'bio' | 'experience' | 'isAvailable' | 'isApproved' | 'averageRating' | 'totalReviews'> {}

class Provider extends Model<ProviderAttributes, ProviderCreationAttributes> implements ProviderAttributes {
  public id!: string;
  public userId!: string;
  public bio?: string;
  public experience?: number;
  public isAvailable!: boolean;
  public isApproved!: boolean;
  public averageRating!: number;
  public totalReviews!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Provider.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,  // requires admin approval
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'providers',
    modelName: 'Provider',
  }
);

export default Provider;
