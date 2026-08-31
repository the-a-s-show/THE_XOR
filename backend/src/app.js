import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';

import logger from './utils/logger.js';

// Middleware
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/validation.js';
import authRoutes from './modules/auth/routes.js';

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());
app.use(cors({
  origin: [env.FRONTEND_URL, env.ADMIN_URL],
  credentials: true,
}));
app.use(globalLimiter);

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Input Sanitization
 */
app.use(sanitizeInput);

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * API Routes (To be imported once created)
 */
app.use('/api/v1/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/problems', problemRoutes);
// app.use('/api/submissions', submissionRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/sheets', sheetRoutes);
// app.use('/api/contests', contestRoutes);
// app.use('/api/blog', blogRoutes);
// app.use('/api/admin', adminRoutes);

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
