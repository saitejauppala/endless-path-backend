import app from './app';
import sequelize from './config/database';
import { config } from './config/config';

// Import to register model associations before sync
import './models/index';

const PORT = config.server.port;

const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    // Only sync schema in development — never alter tables automatically in production
    if (config.server.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized (dev mode).');
    }



    app.listen(PORT,'0.0.0.0',() => {
      console.log(`🚀 Endless Path API running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
