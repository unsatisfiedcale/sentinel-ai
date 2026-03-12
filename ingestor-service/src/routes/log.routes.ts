import { Router } from 'express';
import { ingestorLog } from '../controllers/log.controllers';
import { logSchema } from '../schemas/log.schemas';
import { validate } from '../middlewares/validate.middleware';
import { validateApiKey } from '../middlewares/apiKey.middleware'; // 1. Muhafızı çağır

const router = Router();

router.post('/ingest', validateApiKey, validate(logSchema), ingestorLog);

export default router;
