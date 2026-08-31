import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

/**
 * Format log message with timestamp
 */
const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] [${level}] ${message}`;
  
  if (data) {
    log += ` | ${JSON.stringify(data)}`;
  }
  
  return log;
};

/**
 * Logger utility
 */
const logger = {
  error: (message, data = null) => {
    const log = formatLog(LOG_LEVELS.ERROR, message, data);
    console.error(`❌ ${log}`);
    if (process.env.LOG_FILE) {
      fs.appendFileSync(process.env.LOG_FILE || 'logs/app.log', log + '\n');
    }
  },

  warn: (message, data = null) => {
    const log = formatLog(LOG_LEVELS.WARN, message, data);
    console.warn(`⚠️  ${log}`);
    if (process.env.LOG_FILE) {
      fs.appendFileSync(process.env.LOG_FILE || 'logs/app.log', log + '\n');
    }
  },

  info: (message, data = null) => {
    const log = formatLog(LOG_LEVELS.INFO, message, data);
    console.log(`ℹ️  ${log}`);
    if (process.env.LOG_FILE) {
      fs.appendFileSync(process.env.LOG_FILE || 'logs/app.log', log + '\n');
    }
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      const log = formatLog(LOG_LEVELS.DEBUG, message, data);
      console.log(`🐛 ${log}`);
      if (process.env.LOG_FILE) {
        fs.appendFileSync(process.env.LOG_FILE || 'logs/app.log', log + '\n');
      }
    }
  },
};

export default logger;
