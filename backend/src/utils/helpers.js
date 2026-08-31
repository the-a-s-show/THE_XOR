/**
 * Helper functions for common operations
 */

/**
 * Generate a random string for tokens, codes, etc.
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate URL slug from text
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate pagination skip value
 */
export const calculateSkip = (page, limit) => {
  return (Math.max(1, page) - 1) * limit;
};

/**
 * Format pagination response
 */
export const formatPaginationResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page: Math.max(1, page),
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Success response formatter
 */
export const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

/**
 * Error response formatter
 */
export const errorResponse = (message = 'Error', statusCode = 500, errors = null) => {
  return {
    success: false,
    statusCode,
    message,
    errors,
  };
};

/**
 * Generate mock submission response (for testing)
 */
export const generateMockSubmissionResponse = () => {
  const statuses = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    status,
    timeMs: Math.floor(Math.random() * 100) + 10,
    memoryMB: Math.floor(Math.random() * 50) + 5,
    testsPassed: status === 'Accepted' ? 5 : Math.floor(Math.random() * 5),
    totalTests: 5,
  };
};

export default {
  generateRandomString,
  generateSlug,
  calculateSkip,
  formatPaginationResponse,
  successResponse,
  errorResponse,
  generateMockSubmissionResponse,
};
