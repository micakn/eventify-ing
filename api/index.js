// api/index.js
// Punto de entrada para Vercel (Serverless Function)
import app from '../app.js';
import { connectMongo } from '../db/mongoose.js';

// Exportar como handler para Vercel
export default async function handler(req, res) {
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
  return app(req, res);
}

