import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Attributes interface — describes the full shape of a User row
export interface UserAttributes {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: 'customer' | 'provider' | 'admin';
  profileImage?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Fields that are optional during creation (auto-generated)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'profileImage' | 'latitude' | 'longitude' | 'isActive'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public phone!: string;
  public password!: string;
  public role!: 'customer' | 'provider' | 'admin';
  public profileImage?: string;
  public latitude?: number;
  public longitude?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('customer', 'provider', 'admin'),
      allowNull: false,
      defaultValue: 'customer',
    },
    profileImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  }
);

export default User;
