// api/index.js
// Punto de entrada para Vercel (Serverless Function)
import { connectMongo } from '../db/mongoose.js';

// Importar la app de forma lazy para capturar errores de inicialización
let app = null;
let appError = null;

async function getApp() {
  // Si ya intentamos cargar la app y falló, lanzar el error
  if (appError) {
    throw appError;
  }
  
  // Si la app ya está cargada, retornarla
  if (app) {
    return app;
  }
  
  // Intentar cargar la app
  try {
    const appModule = await import('../app.js');
    app = appModule.default;
    return app;
  } catch (error) {
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
    
    // Devolver la app de Express como handler
    // Express manejará la respuesta automáticamente
    // Nota: Express no retorna una promesa, pero maneja las respuestas directamente
    return expressApp(req, res);
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

