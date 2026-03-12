import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// POST /api/v1/auth/register
// Önce validate çalışır, hata yoksa register controller'ına geçer
router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

export default router;
