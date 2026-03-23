import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import serviceRoutes from './modules/services/service.routes';
import providerRoutes from './modules/provider/provider.routes';
import bookingRoutes from './modules/booking/booking.routes';
import reviewRoutes from './modules/reviews/review.routes';
import adminRoutes from './modules/admin/admin.routes';

// Import model associations (this sets up all FK links)
import './models/index';

// Error handler (must be last)
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// ── Security & Parsing Middlewares ─────────────────────────
app.use(helmet());                      // Set security HTTP headers
app.use(cors({                          // Explicit CORS — required for Android/mobile clients
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,                   // must be false when origin is '*'
}));
app.use(morgan('dev'));                  // HTTP request logger
app.use(express.json());                // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ── Health Check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'Endless Path API', timestamp: new Date() });
});

// ── DB Connectivity Test ──────────────────────────────────
app.get('/test-db', async (_req, res) => {
  try {
    const sequelize = (await import('./config/database')).default;
    await sequelize.authenticate();
    res.json({ success: true, message: 'DB CONNECTED SUCCESS — Railway MySQL' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'DB FAILED', error: err.message });
  }
});

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// ── Root Health Route (must be before 404 handler) ──────
app.get('/', (_req, res) => {
  res.send('API RUNNING — Endless Path');
});

// ── 404 Handler ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler (MUST be last) ──────────────────
app.use(errorHandler);

export default app;
