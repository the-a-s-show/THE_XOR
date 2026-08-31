import { Router } from 'express';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { login, register, verifyEmail } from './controller.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/verify-email', authLimiter, verifyEmail);

export default router;