import { Router } from 'express';
import { register, login, refreshToken, logout, healthCheck } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validation/auth.validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/health', healthCheck);

export default router;
