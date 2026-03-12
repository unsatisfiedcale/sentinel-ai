import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getProfile } from '../controllers/user.controller.js';

const router = Router();

// Middleware'i buraya koyarsak altındaki tüm user rotaları korunmuş olur
router.use(authenticate);

router.get('/me', getProfile);

export default router;
