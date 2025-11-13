// api/index.js
// Punto de entrada para Vercel (Serverless Function)
// OPTIMIZADO para reducir cold starts y mejorar rendimiento
import { connectMongo } from '../db/mongoose.js';

// Cache global para la app y conexión MongoDB
// Esto permite reutilizar entre invocaciones en Vercel
let app = null;
let appError = null;
let mongoConnected = false;
let mongoPromise = null;

// Pre-cargar la app de forma asíncrona en el módulo
// Esto reduce el tiempo de respuesta en la primera request
const appPromise = (async () => {
  if (app) return app;
  if (appError) throw appError;
  
  try {
    const appModule = await import('../app.js');
    app = appModule.default;
    return app;
  } catch (error) {
    appError = error;
    throw error;
  }
})();

// Pre-conectar a MongoDB si está disponible
// Esto reduce el tiempo de la primera conexión
const initMongo = async () => {
  if (mongoConnected || mongoPromise) {
    return mongoPromise;
  }
  
  if (process.env.MONGODB_URI) {
    mongoPromise = connectMongo(process.env.MONGODB_URI)
      .then(() => {
        mongoConnected = true;
        return true;
      })
      .catch((error) => {
        console.error('Error en conexión MongoDB:', error.message);
        mongoPromise = null;
        return false;
      });
    return mongoPromise;
  }
  return Promise.resolve(false);
};

// Inicializar MongoDB en paralelo con la carga de la app
initMongo().catch(() => {});

// Exportar como handler para Vercel
export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    // Obtener la app (ya pre-cargada o cargarla ahora)
    const expressApp = await appPromise;
    
    // Asegurar conexión a MongoDB ANTES de procesar la request
    // Esto es crítico para que las queries funcionen correctamente
    if (process.env.MONGODB_URI) {
      try {
        // Si no está conectado, esperar a que se conecte
        if (!mongoConnected) {
          await initMongo();
        }
        // Verificar que la conexión esté realmente activa
        // Importar mongoose para verificar el estado
        const mongooseModule = await import('mongoose');
        const mongoose = mongooseModule.default;
        
        if (mongoose.connection.readyState !== 1) {
          // Si no está conectado, intentar reconectar
          mongoConnected = false;
          mongoPromise = null;
          await initMongo();
        }
      } catch (mongoError) {
        console.error('❌ Error al conectar MongoDB en handler:', mongoError.message);
        // Continuar de todas formas, pero la conexión puede fallar
      }
    }
    
    // Ejecutar Express directamente
    expressApp(req, res);
    
    // Log de rendimiento solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime;
      if (duration > 1000) {
        console.log(`⏱️  Request handled in ${duration}ms`);
      }
    }
  } catch (error) {
    // Manejar errores de inicialización
    console.error('❌ Error en handler de Vercel:', error.message);
    
    if (!res.headersSent) {
      const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
      const showDetails = process.env.NODE_ENV === 'development' || isVercel;
      
      res.status(500).json({
        mensaje: 'Error interno del servidor',
        detalle: showDetails ? error.message : 'Ocurrió un error inesperado',
        tipo: showDetails ? error.name : undefined
      });
    }
  }
}

