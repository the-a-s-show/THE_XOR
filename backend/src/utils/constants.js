/**
 * Common constants used across the application
 */

export const ROLES = {
  USER: 'USER',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const DIFFICULTY = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export const SUBMISSION_STATUS = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  TIME_LIMIT: 'Time Limit Exceeded',
  RUNTIME_ERROR: 'Runtime Error',
  COMPILATION_ERROR: 'Compilation Error',
  MEMORY_LIMIT: 'Memory Limit Exceeded',
};

export const PROGRAMMING_LANGUAGES = {
  PYTHON: 'python',
  JAVA: 'java',
  CPP: 'cpp',
  JAVASCRIPT: 'javascript',
  GO: 'go',
};

export const CONTEST_STATUS = {
  UPCOMING: 'Upcoming',
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed',
};

export const NOTIFICATION_TYPE = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const ANNOUNCEMENT_TYPE = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ALERT: 'alert',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const CACHE_KEYS = {
  LEADERBOARD: 'cache:leaderboard',
  USER_PROFILE: (userId) => `cache:user:${userId}`,
  PROBLEM: (problemId) => `cache:problem:${problemId}`,
  PROBLEMS_LIST: 'cache:problems:list',
  TOPICS: 'cache:topics',
  COMPANIES: 'cache:companies',
  DAILY_CHALLENGE: 'cache:daily:challenge',
};

export const CACHE_EXPIRY = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

export default {
  ROLES,
  DIFFICULTY,
  SUBMISSION_STATUS,
  PROGRAMMING_LANGUAGES,
  CONTEST_STATUS,
  NOTIFICATION_TYPE,
  ANNOUNCEMENT_TYPE,
  PAGINATION,
  CACHE_KEYS,
  CACHE_EXPIRY,
};
