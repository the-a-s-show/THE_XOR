import { errorResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Middleware to verify mock access token
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse('No token provided', 401));
    }

    if (!token.startsWith('mock-access-token-')) {
      return res.status(401).json(errorResponse('Invalid token', 401));
    }

    // Mock decode: extract the user ID
    const userId = token.replace('mock-access-token-', '');
    req.user = { id: userId, role: 'USER' }; // Default role as USER for simplicity
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid token', 401));
  }
};

/**
 * Middleware to verify mock refresh token
 */
export const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.body.refresh_token || req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json(errorResponse('No refresh token provided', 401));
    }

    if (!refreshToken.startsWith('mock-refresh-token-')) {
      return res.status(401).json(errorResponse('Invalid refresh token', 401));
    }

    const userId = refreshToken.replace('mock-refresh-token-', '');
    req.user = { id: userId, role: 'USER' };
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid refresh token', 401));
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token && token.startsWith('mock-access-token-')) {
      const userId = token.replace('mock-access-token-', '');
      req.user = { id: userId, role: 'USER' };
    }
    next();
  } catch (error) {
    logger.debug('Optional auth failed, continuing as unauthenticated', error.message);
    next();
  }
};

export default {
  verifyToken,
  verifyRefreshToken,
  optionalAuth,
};
