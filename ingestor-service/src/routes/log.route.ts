import { Router } from 'express';
import { ingestorLog } from '../controllers/log.controllers';
import { logSchema } from '../schemas/log.schemas';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// "Önce doğrulaması, sonra controller'a gitmesi için yapıldı"
router.post('/', validate(logSchema), ingestorLog);

export default router;
