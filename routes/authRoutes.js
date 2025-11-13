// routes/authRoutes.js
// -------------------- RUTAS DE AUTENTICACIÓN --------------------
import express from 'express';
import authController from '../controllers/authController.js';
import { authenticateJWT, requireAuth, requireRole } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { validate } from '../middleware/validations.js';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
// Middleware de validación para rutas web (renderiza vista en caso de error)
const validateLoginWeb = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/login', {
        title: 'Login - Eventify',
        error: errors.array()[0].msg
      });
    }
    next();
  }
];

// Validación para API (devuelve JSON)
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
router.post('/login', (req, res, next) => {
  console.log('🔐 POST /auth/login recibido');
  next();
}, validateLoginWeb, authController.loginWeb);
// Logout: acepta tanto GET (desde enlaces) como POST (desde formularios)
// No requiere requireAuth estricto porque puede que la sesión ya esté en proceso de cerrarse
router.get('/logout', (req, res, next) => {
  // Si hay usuario, permitir continuar, si no, redirigir directamente al login
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }
  // Si no hay sesión, limpiar cookies y redirigir
  res.clearCookie('connect.sid', { path: '/', httpOnly: true });
  res.redirect('/login');
}, authController.logoutWeb);
router.post('/logout', (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }
  res.clearCookie('connect.sid', { path: '/', httpOnly: true });
  res.redirect('/login');
}, authController.logoutWeb);

// -------------------- RUTAS API (JWT) --------------------
router.post('/api/login', validateLogin, authController.loginAPI);
router.post('/api/logout', authenticateJWT, authController.logoutAPI);
router.post('/api/register', validateRegister, requireRole('administrador'), authController.register);
router.get('/api/verify', authenticateJWT, authController.verifyToken);
router.post('/api/recovery', authController.requestPasswordRecovery);
router.post('/api/reset-password', authController.resetPassword);

// -------------------- RUTA ESPECIAL: Inicializar administrador (solo para producción inicial) --------------------
// Esta ruta permite crear el primer usuario administrador en producción
// Requiere la variable de entorno INIT_ADMIN_SECRET
router.post('/api/init-admin', authController.initAdmin);
router.get('/api/init-admin', authController.initAdmin); // También por GET para facilitar el uso

export default router;

