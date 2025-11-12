// tests/setup.js
// -------------------- CONFIGURACIÓN INICIAL PARA TESTS --------------------
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-session-secret';

// La conexión a la base de datos se hará en cada archivo de test individualmente
// para evitar problemas con múltiples archivos de test
