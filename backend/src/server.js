import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

const PORT = env.PORT || 5000;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
      logger.info(`🔗 Admin URL: ${env.ADMIN_URL}`);
      logger.info(`✅ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;