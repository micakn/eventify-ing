// middleware/auth.js
// -------------------- MIDDLEWARES DE AUTENTICACIÓN Y AUTORIZACIÓN --------------------
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion';

// -------------------- MIDDLEWARE: Autenticación para sesiones web (Passport) --------------------
export const authenticateSession = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'Login - Eventify',
        error: info?.message || 'Credenciales inválidas'
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};

// -------------------- MIDDLEWARE: Verificar sesión activa (para rutas web) --------------------
export const requireAuth = (req, res, next) => {
  // Log para debugging en Vercel
  const isAuthenticated = req.isAuthenticated && req.isAuthenticated();
  const hasUser = !!req.user;
  
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    console.log(`🔐 requireAuth - isAuthenticated: ${isAuthenticated}, hasUser: ${hasUser}, path: ${req.path}`);
  }
  
  // Verificar si hay una sesión activa
  if (isAuthenticated) {
    // Verificar que el usuario existe y está activo
    if (req.user && req.user.activo !== false) {
      return next();
    } else if (req.user && req.user.activo === false) {
      // Usuario inactivo
      req.logout(() => {
        res.redirect('/login?error=usuario-inactivo');
      });
      return;
    }
  }
  
  // Si no está autenticado, redirigir al login
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    console.log(`❌ requireAuth falló - redirigiendo a /login desde ${req.path}`);
  }
  res.redirect('/login');
};

// -------------------- MIDDLEWARE: Autenticación JWT (para API) --------------------
export const authenticateJWT = passport.authenticate('jwt', { session: false });

// -------------------- MIDDLEWARE: Verificar token JWT manualmente (alternativa) --------------------
export const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'No autorizado',
        detalle: 'Token JWT no proporcionado'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        mensaje: 'Token expirado',
        detalle: 'El token JWT ha expirado'
      });
    }
    
    return res.status(401).json({
      mensaje: 'Token inválido',
      detalle: 'El token JWT proporcionado no es válido'
    });
  }
};

// -------------------- MIDDLEWARE: Autorización por roles --------------------
export const requireRole = (...roles) => {
  return (req, res, next) => {
    const user = req.user || req.session?.user;
    
    if (!user) {
      return res.status(401).json({
        mensaje: 'No autenticado',
        detalle: 'Debe iniciar sesión para acceder a este recurso'
      });
    }

    if (!roles.includes(user.rol)) {
      return res.status(403).json({
        mensaje: 'Acceso denegado',
        detalle: `No tiene permisos para realizar esta acción. Roles requeridos: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// -------------------- MIDDLEWARE: Autorización por roles (alias) --------------------
export const authorizeRoles = (...roles) => {
  return requireRole(...roles);
};

// -------------------- MIDDLEWARE: Verificar rol para vistas web --------------------
export const requireRoleWeb = (...roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).render('error', {
        title: 'Acceso Denegado',
        message: 'No tiene permisos para acceder a esta sección'
      });
    }

    next();
  };
};

// -------------------- FUNCIÓN: Generar token JWT --------------------
export const generateToken = (usuario) => {
  const payload = {
    id: usuario._id || usuario.id,
    email: usuario.email,
    rol: usuario.rol
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// -------------------- FUNCIÓN: Verificar token JWT --------------------
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

