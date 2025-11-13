// controllers/authController.js
// -------------------- CONTROLADOR DE AUTENTICACIÓN --------------------
import UsuarioModel from '../models/UsuarioModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import { generateToken, authenticateSession } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import AuditoriaModel from '../models/AuditoriaModel.js';
import crypto from 'crypto';

// -------------------- LOGIN (Para vistas web con sesión) --------------------
const loginWeb = asyncHandler(async (req, res, next) => {
  authenticateSession(req, res, async () => {
    // Si llegamos aquí, la autenticación fue exitosa
    try {
      // Registrar auditoría de login
      const usuarioId = req.user.id || req.user._id;
      const empleadoId = req.user.empleado 
        ? (typeof req.user.empleado === 'object' 
            ? (req.user.empleado.id || req.user.empleado._id)
            : req.user.empleado)
        : null;
      
      await AuditoriaModel.registrar({
        accion: 'login',
        entidad: 'Usuario',
        entidadId: String(usuarioId),
        usuario: usuarioId,
        empleado: empleadoId,
        ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '',
        userAgent: req.get('user-agent') || '',
        fecha: new Date(),
        resultado: 'success',
        mensaje: 'Login exitoso',
        metadata: {
          metodo: req.method,
          url: req.originalUrl,
          rol: req.user.rol
        }
      });
    } catch (error) {
      console.error('Error al registrar auditoría de login:', error);
      // No interrumpir el flujo si falla la auditoría
    }
    
    // Redirigir según el rol
    const redirectUrl = getRedirectUrlByRole(req.user.rol);
    res.redirect(redirectUrl);
  });
});

// -------------------- LOGIN (Para API con JWT) --------------------
const loginAPI = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      mensaje: 'Datos incompletos',
      detalle: 'Email y contraseña son requeridos'
    });
  }

  const usuario = await UsuarioModel.getByEmail(email);

  if (!usuario) {
    return res.status(401).json({
      mensaje: 'Credenciales inválidas',
      detalle: 'Email o contraseña incorrectos'
    });
  }

  if (!usuario.activo) {
    return res.status(403).json({
      mensaje: 'Usuario inactivo',
      detalle: 'Su cuenta ha sido desactivada'
    });
  }

  if (usuario.isBlocked()) {
    return res.status(403).json({
      mensaje: 'Usuario bloqueado',
      detalle: `Su cuenta está bloqueada hasta ${usuario.bloqueadoHasta.toLocaleString()}`
    });
  }

  const isMatch = await usuario.comparePassword(password);

  if (!isMatch) {
    await usuario.incrementFailedAttempts();
    return res.status(401).json({
      mensaje: 'Credenciales inválidas',
      detalle: 'Email o contraseña incorrectos'
    });
  }

  // Contraseña correcta
  await usuario.resetFailedAttempts();
  await usuario.updateLastAccess();

  // Registrar auditoría de login
  try {
    const usuarioId = usuario._id || usuario.id;
    const empleadoId = usuario.empleado 
      ? (typeof usuario.empleado === 'object' 
          ? (usuario.empleado._id || usuario.empleado.id)
          : usuario.empleado)
      : null;
    
    await AuditoriaModel.registrar({
      accion: 'login',
      entidad: 'Usuario',
      entidadId: String(usuarioId),
      usuario: usuarioId,
      empleado: empleadoId,
      ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '',
      userAgent: req.get('user-agent') || '',
      fecha: new Date(),
      resultado: 'success',
      mensaje: 'Login exitoso',
      metadata: {
        metodo: req.method,
        url: req.originalUrl,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error al registrar auditoría de login:', error);
    // No interrumpir el flujo si falla la auditoría
  }

  const token = generateToken(usuario);
  const usuarioData = await UsuarioModel.getById(usuario._id);

  res.json({
    mensaje: 'Login exitoso',
    token,
    usuario: usuarioData,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
});

// -------------------- LOGOUT (Para vistas web) --------------------
const logoutWeb = asyncHandler(async (req, res) => {
  const usuarioId = req.user?.id || req.user?._id;
  const empleadoId = req.user?.empleado?.id || req.user?.empleado?._id || null;
  
  req.logout(async (err) => {
    if (err) {
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Error al cerrar sesión'
      });
    }
    
    // Registrar auditoría de logout
    if (usuarioId) {
      try {
        await AuditoriaModel.registrar({
          accion: 'logout',
          entidad: 'Usuario',
          entidadId: usuarioId,
          usuario: usuarioId,
          empleado: empleadoId,
          ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '',
          userAgent: req.get('user-agent') || '',
          fecha: new Date(),
          resultado: 'success',
          mensaje: 'Logout exitoso',
          metadata: {
            metodo: req.method,
            url: req.originalUrl
          }
        });
      } catch (error) {
        console.error('Error al registrar auditoría de logout:', error);
        // No interrumpir el flujo si falla la auditoría
      }
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
});

// -------------------- LOGOUT (Para API) --------------------
const logoutAPI = asyncHandler(async (req, res) => {
  // Con JWT, el logout es principalmente del lado del cliente
  // El token se invalida simplemente no enviándolo más
  
  // Registrar auditoría de logout si hay usuario autenticado
  if (req.user) {
    try {
      const usuarioId = req.user.id || req.user._id;
      const empleadoId = req.user.empleado 
        ? (typeof req.user.empleado === 'object' 
            ? (req.user.empleado.id || req.user.empleado._id)
            : req.user.empleado)
        : null;
      
      await AuditoriaModel.registrar({
        accion: 'logout',
        entidad: 'Usuario',
        entidadId: String(usuarioId),
        usuario: usuarioId,
        empleado: empleadoId,
        ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '',
        userAgent: req.get('user-agent') || '',
        fecha: new Date(),
        resultado: 'success',
        mensaje: 'Logout exitoso',
        metadata: {
          metodo: req.method,
          url: req.originalUrl
        }
      });
    } catch (error) {
      console.error('Error al registrar auditoría de logout:', error);
      // No interrumpir el flujo si falla la auditoría
    }
  }
  
  res.json({
    mensaje: 'Logout exitoso',
    detalle: 'El token debe ser descartado del cliente'
  });
});

// -------------------- REGISTRO DE USUARIO --------------------
const register = asyncHandler(async (req, res) => {
  const { email, password, rol, empleadoId } = req.body;

  if (!email || !password || !rol || !empleadoId) {
    return res.status(400).json({
      mensaje: 'Datos incompletos',
      detalle: 'Email, contraseña, rol y empleado son requeridos'
    });
  }

  // Verificar que el empleado existe
  const empleado = await EmpleadoModel.getById(empleadoId);
  if (!empleado) {
    return res.status(404).json({
      mensaje: 'Empleado no encontrado',
      detalle: `No existe un empleado con el ID ${empleadoId}`
    });
  }

  // Verificar que no existe otro usuario con ese email
  const usuarioExistente = await UsuarioModel.getByEmail(email);
  if (usuarioExistente) {
    return res.status(409).json({
      mensaje: 'Usuario ya existe',
      detalle: 'Ya existe un usuario con ese email'
    });
  }

  const nuevoUsuario = await UsuarioModel.add({
    email,
    password,
    rol,
    empleado: empleadoId
  });

  if (!nuevoUsuario) {
    return res.status(500).json({
      mensaje: 'Error al crear usuario',
      detalle: 'No se pudo crear el usuario en la base de datos'
    });
  }

  res.status(201).json({
    mensaje: 'Usuario creado exitosamente',
    usuario: nuevoUsuario
  });
});

// -------------------- VERIFICAR TOKEN (Para API) --------------------
const verifyToken = asyncHandler(async (req, res) => {
  // Si llegamos aquí, el middleware de autenticación ya validó el token
  const usuario = await UsuarioModel.getById(req.user.id);
  
  res.json({
    mensaje: 'Token válido',
    usuario
  });
});

// -------------------- SOLICITAR RECUPERACIÓN DE CONTRASEÑA --------------------
const requestPasswordRecovery = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      mensaje: 'Email requerido',
      detalle: 'Debe proporcionar un email'
    });
  }

  const usuario = await UsuarioModel.getByEmail(email);
  
  if (!usuario) {
    // Por seguridad, no revelamos si el email existe o no
    return res.json({
      mensaje: 'Si el email existe, se enviará un enlace de recuperación'
    });
  }

  // Generar token de recuperación
  const token = crypto.randomBytes(32).toString('hex');
  const expiration = new Date(Date.now() + 3600000); // 1 hora

  await UsuarioModel.setRecoveryToken(email, token, expiration);

  // TODO: Enviar email con el token
  // Por ahora, solo devolvemos el token (en producción, enviar por email)
  res.json({
    mensaje: 'Token de recuperación generado',
    detalle: 'En producción, esto se enviaría por email',
    token: token // Solo para desarrollo, eliminar en producción
  });
});

// -------------------- RESETEAR CONTRASEÑA --------------------
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      mensaje: 'Datos incompletos',
      detalle: 'Token y nueva contraseña son requeridos'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      mensaje: 'Contraseña inválida',
      detalle: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  const usuario = await UsuarioModel.getByRecoveryToken(token);

  if (!usuario) {
    return res.status(400).json({
      mensaje: 'Token inválido o expirado',
      detalle: 'El token de recuperación no es válido o ha expirado'
    });
  }

  // Actualizar contraseña
  await UsuarioModel.update(usuario._id, {
    password: newPassword,
    tokenRecuperacion: undefined,
    tokenExpiracion: undefined
  });

  res.json({
    mensaje: 'Contraseña actualizada exitosamente',
    detalle: 'Puede iniciar sesión con su nueva contraseña'
  });
});

// -------------------- INICIALIZAR USUARIO ADMINISTRADOR (Solo para producción inicial) --------------------
const initAdmin = asyncHandler(async (req, res) => {
  // Verificar que existe la clave secreta de inicialización
  const initSecret = process.env.INIT_ADMIN_SECRET;
  
  if (!initSecret) {
    return res.status(503).json({
      mensaje: 'Servicio no disponible',
      detalle: 'La inicialización de administrador no está configurada'
    });
  }

  // Verificar que se proporcionó la clave secreta
  const providedSecret = req.body.secret || req.query.secret;
  
  if (providedSecret !== initSecret) {
    return res.status(401).json({
      mensaje: 'No autorizado',
      detalle: 'Clave secreta inválida'
    });
  }

  // Verificar si ya existe un usuario administrador
  const usuarios = await UsuarioModel.getAll();
  const adminExists = usuarios.some(u => u.rol === 'administrador');
  
  if (adminExists) {
    return res.status(409).json({
      mensaje: 'Ya existe un administrador',
      detalle: 'El sistema ya tiene un usuario administrador. Use el endpoint de registro normal.'
    });
  }

  // Buscar o crear un empleado administrador
  let empleadoAdmin = await EmpleadoModel.getAll();
  empleadoAdmin = empleadoAdmin.find(e => e.rol === 'administrador');

  if (!empleadoAdmin) {
    // Crear empleado administrador si no existe
    empleadoAdmin = await EmpleadoModel.add({
      nombre: 'Administrador Sistema',
      rol: 'administrador',
      area: 'Administración',
      email: 'admin@eventify.com',
      telefono: '+5491100000000'
    });
    
    if (!empleadoAdmin) {
      return res.status(500).json({
        mensaje: 'Error al crear empleado administrador',
        detalle: 'No se pudo crear el empleado administrador'
      });
    }
  }

  // Verificar si ya existe un usuario con ese email
  const usuarioExistente = await UsuarioModel.getByEmail('admin@eventify.com');
  
  if (usuarioExistente) {
    return res.status(409).json({
      mensaje: 'Usuario ya existe',
      detalle: 'Ya existe un usuario con el email admin@eventify.com'
    });
  }

  // Crear usuario administrador
  const adminUsuario = await UsuarioModel.add({
    email: 'admin@eventify.com',
    password: 'admin123', // Cambiar después del primer login
    rol: 'administrador',
    empleado: empleadoAdmin.id,
    activo: true
  });

  if (!adminUsuario) {
    return res.status(500).json({
      mensaje: 'Error al crear usuario administrador',
      detalle: 'No se pudo crear el usuario administrador'
    });
  }

  res.status(201).json({
    mensaje: 'Usuario administrador creado exitosamente',
    detalle: 'Puede iniciar sesión con las credenciales proporcionadas',
    credenciales: {
      email: 'admin@eventify.com',
      password: 'admin123'
    },
    advertencia: 'IMPORTANTE: Cambiar la contraseña después del primer login'
  });
});

// -------------------- FUNCIÓN AUXILIAR: Obtener URL de redirección por rol --------------------
function getRedirectUrlByRole(rol) {
  const redirects = {
    administrador: '/',
    productor: '/',
    financiero: '/',
    diseñador: '/'
  };
  return redirects[rol] || '/';
}

export default {
  loginWeb,
  loginAPI,
  logoutWeb,
  logoutAPI,
  register,
  verifyToken,
  requestPasswordRecovery,
  resetPassword,
  initAdmin
};

