// routes/auditoriaWebRoutes.js
import express from 'express';
import auditoriaWebController from '../controllers/auditoriaWebController.js';

const router = express.Router();

router.get('/', auditoriaWebController.listAuditoriaWeb);
router.get('/:id', auditoriaWebController.showAuditoria);

export default router;

