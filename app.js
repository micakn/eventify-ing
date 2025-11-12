// app.js
// -------------------- Imports --------------------
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';

// Importar routers
import tareaRoutes from './routes/tareaRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js'; // API
import clienteWebRoutes from './routes/clienteWebRoutes.js'; // Vistas web
import eventoRoutes from './routes/eventoRoutes.js';

// Middleware de manejo de errores
import { errorHandler } from './middleware/errorHandler.js';

// Rutas de autenticación
import authRoutes from './routes/authRoutes.js';

// Modelos (usarán Mongoose internamente)
import ClienteModel from './models/ClienteModel.js';
import EmpleadoModel from './models/EmpleadoModel.js';
import EventoModel from './models/EventoModel.js';
import TareaModel from './models/TareaModel.js';

// Conexión a Mongo
import { connectMongo } from './db/mongoose.js';
import mongoose from 'mongoose';

// -------------------- Configuración --------------------
// Solo cargar dotenv si no estamos en Vercel (donde las variables ya están disponibles)
// Vercel establece VERCEL=1 o VERCEL_ENV
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
if (!isVercel) {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Middlewares --------------------
app.use(express.json()); // Permite recibir JSON
app.use(express.urlencoded({ extended: true })); // Formularios
app.use(methodOverride('_method')); // Permite usar DELETE/PUT desde formularios

// -------------------- Configuración de Sesiones --------------------
// Configurar sesiones con MongoStore solo si MONGODB_URI está disponible y es válido
// En serverless, usar sesiones en memoria como fallback
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'tu-session-secret-cambiar-en-produccion',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 días
  }
};

// Validar MONGODB_URI ANTES de intentar crear MongoStore
// Esto previene el error "You must provide either mongoUrl|clientPromise|client in options"
const mongoUri = process.env.MONGODB_URI;

// Validación exhaustiva con logging
console.log('🔍 Verificando MONGODB_URI para MongoStore...');
console.log('MONGODB_URI existe:', !!mongoUri);
console.log('Tipo de MONGODB_URI:', typeof mongoUri);

let hasValidMongoUri = false;
let trimmedUri = '';

// Validación exhaustiva paso a paso
if (!mongoUri) {
  console.warn('⚠️  MONGODB_URI no está definida, usando sesiones en memoria');
} else if (typeof mongoUri !== 'string') {
  console.warn('⚠️  MONGODB_URI no es una cadena, usando sesiones en memoria');
} else {
  trimmedUri = mongoUri.trim();
  console.log('MONGODB_URI trimmed length:', trimmedUri.length);
  console.log('MONGODB_URI starts with mongodb:', trimmedUri.startsWith('mongodb://') || trimmedUri.startsWith('mongodb+srv://'));
  
  if (trimmedUri.length === 0) {
    console.warn('⚠️  MONGODB_URI está vacía después de trim, usando sesiones en memoria');
  } else if (!trimmedUri.startsWith('mongodb://') && !trimmedUri.startsWith('mongodb+srv://')) {
    console.warn('⚠️  MONGODB_URI no tiene formato válido, usando sesiones en memoria');
  } else {
    hasValidMongoUri = true;
    console.log('✅ MONGODB_URI es válida, intentando crear MongoStore');
  }
}

// Solo crear MongoStore si hay una URI válida Y no está vacía
// Verificación final antes de crear MongoStore
if (hasValidMongoUri && trimmedUri && typeof trimmedUri === 'string' && trimmedUri.length > 10) {
  // Verificación adicional: asegurar que trimmedUri realmente tiene un valor válido
  const finalUri = String(trimmedUri).trim();
  if (finalUri && finalUri.length > 0 && (finalUri.startsWith('mongodb://') || finalUri.startsWith('mongodb+srv://'))) {
    try {
      console.log('🔧 Creando MongoStore con URI (primeros 30 chars):', finalUri.substring(0, 30));
      // Verificación final antes de llamar a create
      if (!finalUri || finalUri.length === 0) {
        throw new Error('URI está vacía');
      }
      const store = MongoStore.create({
        mongoUrl: finalUri,
        ttl: 14 * 24 * 60 * 60 // 14 días
      });
      sessionConfig.store = store;
      console.log('✅ MongoStore configurado exitosamente para sesiones');
    } catch (error) {
      console.error('❌ Error al crear MongoStore:', error.message);
      console.error('Stack:', error.stack);
      console.warn('⚠️  Continuando con sesiones en memoria');
      // NO asignar store - usar sesiones en memoria
    }
  } else {
    console.warn('⚠️  URI final no es válida, usando sesiones en memoria');
  }
} else {
  console.warn('⚠️  No se creará MongoStore - usando sesiones en memoria');
  console.warn('hasValidMongoUri:', hasValidMongoUri);
  console.warn('trimmedUri existe:', !!trimmedUri);
  console.warn('trimmedUri length:', trimmedUri ? trimmedUri.length : 0);
  // No crear MongoStore - usar sesiones en memoria
}

app.use(session(sessionConfig));

// -------------------- Inicializar Passport --------------------
app.use(passport.initialize());
app.use(passport.session());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'publics')));

// Middleware para currentPath y usuario (útil en layout)
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.user = req.user || null; // Disponible en todas las vistas
  next();
});

// -------------------- Motor de vistas --------------------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// -------------------- Rutas --------------------

// Health check endpoint (útil para debugging en Vercel)
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: !!(process.env.VERCEL || process.env.VERCEL_ENV),
    mongodb: {
      configured: !!process.env.MONGODB_URI,
      connected: mongoose.connection.readyState === 1
    },
    variables: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasSessionSecret: !!process.env.SESSION_SECRET
    }
  };
  res.status(200).json(health);
});

// Ruta principal
app.get('/', async (req, res) => {
  try {
    const tareas = await TareaModel.getAll();
    const empleados = await EmpleadoModel.getAll();
    const clientes = await ClienteModel.getAll();
    const eventos = await EventoModel.getAll();

    res.render('index', {
      title: 'Eventify - Backend',
      tareas,
      empleados,
      clientes,
      eventos
    });
  } catch (error) {
    console.error('Error al cargar index:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la página principal' });
  }
});

// -------------------- Rutas Públicas --------------------
// Ruta de login (debe estar antes de las rutas protegidas)
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Login - Eventify' });
});

// -------------------- Routers --------------------

// Autenticación (login/logout)
app.use('/auth', authRoutes);

// Web (vistas Pug) - Protegidas
import { requireAuth, requireRoleWeb } from './middleware/auth.js';
import empleadoWebRoutes from './routes/empleadoWebRoutes.js';
import eventoWebRoutes from './routes/eventoWebRoutes.js';
import tareaWebRoutes from './routes/tareaWebRoutes.js';
import proveedorWebRoutes from './routes/proveedorWebRoutes.js';
import cotizacionWebRoutes from './routes/cotizacionWebRoutes.js';
import invitadoWebRoutes from './routes/invitadoWebRoutes.js';
import hitoWebRoutes from './routes/hitoWebRoutes.js';
import gastoWebRoutes from './routes/gastoWebRoutes.js';
import facturaWebRoutes from './routes/facturaWebRoutes.js';
import auditoriaWebRoutes from './routes/auditoriaWebRoutes.js';

app.use('/clientes', requireAuth, clienteWebRoutes);
app.use('/empleados', requireAuth, empleadoWebRoutes);
app.use('/eventos', requireAuth, eventoWebRoutes);
app.use('/tareas', requireAuth, tareaWebRoutes);
app.use('/proveedores', requireAuth, proveedorWebRoutes);
app.use('/cotizaciones', requireAuth, cotizacionWebRoutes);
app.use('/invitados', requireAuth, invitadoWebRoutes);
app.use('/hitos', requireAuth, hitoWebRoutes);
app.use('/gastos', requireAuth, gastoWebRoutes);
app.use('/facturas', requireAuth, facturaWebRoutes);
app.use('/auditoria', requireAuth, requireRoleWeb('administrador', 'financiero'), auditoriaWebRoutes);

// APIs (para pruebas con Thunder Client) - Protegidas con JWT
import { authenticateJWT } from './middleware/auth.js';
// Nota: Las APIs requieren JWT, pero podemos hacerlas opcionales para desarrollo
// En producción, descomentar las siguientes líneas:
// app.use('/api/clientes', authenticateJWT, clienteRoutes);
// app.use('/api/empleados', authenticateJWT, empleadoRoutes);
// app.use('/api/eventos', authenticateJWT, eventoRoutes);
// app.use('/api/tareas', authenticateJWT, tareaRoutes);

// Por ahora, dejamos las APIs sin protección para facilitar pruebas
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/tareas', tareaRoutes);

// Nuevos módulos (RF1: Cotizaciones)
import proveedorRoutes from './routes/proveedorRoutes.js';
import cotizacionRoutes from './routes/cotizacionRoutes.js';
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);

// Nuevos módulos (RF2: Invitados)
import invitadoRoutes from './routes/invitadoRoutes.js';
import rsvpRoutes from './routes/rsvpRoutes.js';
app.use('/api/invitados', invitadoRoutes);
app.use('/rsvp', rsvpRoutes); // Ruta pública para RSVP

// Nuevos módulos (RF3: Cronograma y Responsables)
import hitoRoutes from './routes/hitoRoutes.js';
app.use('/api/hitos', hitoRoutes);

// Nuevos módulos (RF4: Facturación y Cierre Contable)
import gastoRoutes from './routes/gastoRoutes.js';
import facturaRoutes from './routes/facturaRoutes.js';
app.use('/api/gastos', gastoRoutes);
app.use('/api/facturas', facturaRoutes);

// Sistema de auditoría (RNF4)
import auditoriaRoutes from './routes/auditoriaRoutes.js';
app.use('/api/auditoria', auditoriaRoutes);

// -------------------- Manejo de rutas no encontradas --------------------
app.use((req, res) => {
  res.status(404).render('error', { title: '404', message: 'Ruta no encontrada' });
});

// -------------------- Middleware de manejo de errores (debe ir al final) --------------------
app.use(errorHandler);

// Exportar la aplicación para uso en tests y Vercel
// NOTA: El servidor se inicia a través de:
// - server.js en producción local (npm start)
// - api/index.js en Vercel
export default app;
