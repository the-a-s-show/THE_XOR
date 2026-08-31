import { ROLES } from '../utils/constants.js';
import { errorResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Check if user has required role
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(errorResponse('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
      });
      return res.status(403).json(errorResponse('Insufficient permissions', 403));
    }

    next();
  };
};

/**
 * Admin only - SUPER_ADMIN or CONTENT_MANAGER
 */
export const adminOnly = requireRole(ROLES.SUPER_ADMIN, ROLES.CONTENT_MANAGER);

/**
 * Super admin only
 */
export const superAdminOnly = requireRole(ROLES.SUPER_ADMIN);

/**
 * Check if user is the owner of a resource or admin
 */
export const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(errorResponse('Authentication required', 401));
  }

  const resourceOwnerId = req.params.userId || req.body.userId;

  if (req.user.id !== resourceOwnerId && !isAdmin(req.user)) {
    return res.status(403).json(errorResponse('Forbidden', 403));
  }

  next();
};

/**
 * Helper: Check if user is admin
 */
const isAdmin = (user) => {
  return user.role === ROLES.SUPER_ADMIN || user.role === ROLES.CONTENT_MANAGER;
};

export default {
  requireRole,
  adminOnly,
  superAdminOnly,
  isOwnerOrAdmin,
};
