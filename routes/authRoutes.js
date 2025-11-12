// routes/authRoutes.js
// -------------------- RUTAS DE AUTENTICACIÓN --------------------
import express from 'express';
import authController from '../controllers/authController.js';
import { authenticateJWT, requireAuth, requireRole } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validate
];

const validateRegister = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['administrador', 'productor', 'financiero', 'diseñador']).withMessage('Rol inválido'),
  body('empleadoId')
    .notEmpty().withMessage('El empleado es obligatorio')
    .isMongoId().withMessage('ID de empleado inválido'),
  validate
];

// -------------------- RUTAS WEB (Sesiones) --------------------
// Estas rutas usan sesiones de Passport
router.post('/login', validateLogin, authController.loginWeb);
router.post('/logout', requireAuth, authController.logoutWeb);

// -------------------- RUTAS API (JWT) --------------------
router.post('/api/login', validateLogin, authController.loginAPI);
router.post('/api/logout', authenticateJWT, authController.logoutAPI);
router.post('/api/register', validateRegister, requireRole('administrador'), authController.register);
router.get('/api/verify', authenticateJWT, authController.verifyToken);
router.post('/api/recovery', authController.requestPasswordRecovery);
router.post('/api/reset-password', authController.resetPassword);

export default router;

