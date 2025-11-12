// routes/auditoriaRoutes.js
import express from 'express';
import auditoriaController from '../controllers/auditoriaController.js';
import { validateIdParam } from '../middleware/validations.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de auditoría requieren autenticación y rol de administrador
router.use(authenticateJWT);
router.use(authorizeRoles('administrador', 'financiero'));

// -------------------- RUTAS --------------------
router.get('/', auditoriaController.listAuditoria);
router.get('/resumen', auditoriaController.getResumen);
router.get('/usuario/:usuarioId', validateIdParam, auditoriaController.getAuditoriaPorUsuario);
router.get('/entidad/:entidad/:entidadId', auditoriaController.getAuditoriaPorEntidad);
router.get('/:id', validateIdParam, auditoriaController.getAuditoria);

export default router;

