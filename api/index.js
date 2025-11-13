// api/index.js
// Punto de entrada para Vercel (Serverless Function)
import { connectMongo } from '../db/mongoose.js';

// Importar la app de forma lazy para capturar errores de inicialización
let app = null;
let appError = null;
let isConnecting = false;

async function getApp() {
  // Si ya intentamos cargar la app y falló, lanzar el error
  if (appError) {
    throw appError;
  }
  
  // Si la app ya está cargada, retornarla
  if (app) {
    return app;
  }
  
  // Si ya estamos conectando, esperar
  if (isConnecting) {
    // Esperar un poco y reintentar
    await new Promise(resolve => setTimeout(resolve, 100));
    return getApp();
  }
  
  // Intentar cargar la app
  try {
    isConnecting = true;
    const appModule = await import('../app.js');
    app = appModule.default;
    isConnecting = false;
    return app;
  } catch (error) {
    isConnecting = false;
    appError = error;
    console.error('❌ Error al importar app.js:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    console.error('Nombre:', error.name);
    throw error;
  }
}

// Exportar como handler para Vercel
export default async function handler(req, res) {
  try {
    // Obtener la app (con lazy loading para capturar errores de inicialización)
    const expressApp = await getApp();
    
    // Asegurar conexión a MongoDB antes de manejar la request
    // La función connectMongo cachea la conexión, por lo que es seguro
    // llamarla en cada invocación
    if (process.env.MONGODB_URI) {
      try {
        await connectMongo(process.env.MONGODB_URI);
      } catch (error) {
        console.error('Error en conexión MongoDB:', error);
        console.error('Stack:', error.stack);
        // Continuar aunque falle la conexión (para que Vercel no falle)
        // La app manejará el error internamente
      }
    } else {
      console.warn('⚠️  MONGODB_URI no está configurada');
    }
    
    // Ejecutar Express directamente
    // Express maneja las requests y respuestas automáticamente
    // En Vercel, simplemente pasamos req y res a Express
    expressApp(req, res);
  } catch (error) {
    // Manejar errores de inicialización
    // Siempre loguear el error completo para debugging en Vercel
    console.error('❌ Error en handler de Vercel:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    console.error('Nombre:', error.name);
    if (error.code) console.error('Código:', error.code);
    
    // Asegurar que la respuesta no se haya enviado ya
    if (!res.headersSent) {
      // En Vercel, mostrar más información para debugging
      const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
      const showDetails = process.env.NODE_ENV === 'development' || isVercel;
      
      res.status(500).json({
        mensaje: 'Error interno del servidor',
        detalle: showDetails ? error.message : 'Ocurrió un error inesperado',
        tipo: showDetails ? error.name : undefined,
        ...(showDetails && error.stack ? { stack: error.stack } : {})
      });
    }
  }
}

