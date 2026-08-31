import { errorResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Input validation middleware factory
 */
export const validateInput = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validate({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.validated = validated;
      next();
    } catch (error) {
      logger.warn('Validation error', error.errors);
      res.status(400).json(errorResponse('Validation error', 400, error.errors));
    }
  };
};

/**
 * Simple body validation middleware
 */
export const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const errors = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json(errorResponse('Validation error', 400, errors));
    }

    next();
  };
};

/**
 * Sanitize input
 */
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<[^>]*>/g, ''); // Remove HTML tags
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  req.query = sanitize(req.query);

  next();
};

export default {
  validateInput,
  validateBody,
  sanitizeInput,
};
