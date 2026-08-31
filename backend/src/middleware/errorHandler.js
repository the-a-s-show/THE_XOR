import { errorResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Error caught by handler', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json(errorResponse('Validation error', 400, errors));
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json(errorResponse('Invalid ID format', 400));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json(
      errorResponse(`${field} already exists`, 400, [{ [field]: `${field} must be unique` }])
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(errorResponse('Invalid token', 401));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(errorResponse('Token expired', 401));
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json(errorResponse(message, statusCode));
};

/**
 * 404 handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json(errorResponse(`Route not found: ${req.method} ${req.url}`, 404));
};

export default {
  errorHandler,
  notFoundHandler,
};
