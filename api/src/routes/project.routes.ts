import { Router } from 'express';
import { createProject, getProjects, deleteProject } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js'; // Yazdığın JWT middleware'i

const router = Router();

router.use(authenticate);

router.post('/create', createProject);
router.get('/list', getProjects);
router.delete('/delete/:id', deleteProject);

export default router;
