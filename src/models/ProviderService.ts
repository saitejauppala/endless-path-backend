import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Junction table linking providers to the services they offer
export interface ProviderServiceAttributes {
  id: string;
  providerId: string;
  serviceId: string;
}

interface ProviderServiceCreationAttributes extends Optional<ProviderServiceAttributes, 'id'> {}

class ProviderService extends Model<ProviderServiceAttributes, ProviderServiceCreationAttributes>
  implements ProviderServiceAttributes {
  public id!: string;
  public providerId!: string;
  public serviceId!: string;
}

ProviderService.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'providers', key: 'id' },
      onDelete: 'CASCADE',
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'services', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'provider_services',
    modelName: 'ProviderService',
    timestamps: false,
  }
);

export default ProviderService;
