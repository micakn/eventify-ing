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
        // Continuar aunque falle la conexión (para que Vercel no falle)
        // La app manejará el error internamente
      }
    }
    
    // Devolver la app de Express como handler
    // Express manejará la respuesta automáticamente
    return app(req, res);
  } catch (error) {
    // Manejar errores de inicialización
    console.error('Error en handler de Vercel:', error);
    
    // Asegurar que la respuesta no se haya enviado ya
    if (!res.headersSent) {
      res.status(500).json({
        mensaje: 'Error interno del servidor',
        detalle: process.env.NODE_ENV === 'development' ? error.message : 'Ocurrió un error inesperado',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

