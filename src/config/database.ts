import { Sequelize } from 'sequelize';
import { config } from './config';

const isLocalhost = config.database.host === 'localhost' || config.database.host === '127.0.0.1';

// Create Sequelize connection to MariaDB / MySQL
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: config.server.nodeEnv === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Railway public endpoint requires SSL; skip for local dev
    dialectOptions: isLocalhost ? {} : {
      ssl: {
        rejectUnauthorized: false, // Railway uses self-signed certs
      },
    },
  }
);

export default sequelize;
