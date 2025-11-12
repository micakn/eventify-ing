// api/index.js
// Punto de entrada para Vercel (Serverless Function)
import app from '../app.js';
import { connectMongo } from '../db/mongoose.js';

// Exportar como handler para Vercel
export default async function handler(req, res) {
  try {
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
    return app(req, res);
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

