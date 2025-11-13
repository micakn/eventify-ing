// db/mongoose.js
import mongoose from 'mongoose';

// Cachear la conexión para entornos serverless (Vercel)
// Esto permite reutilizar la conexión entre invocaciones
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongo(uri) {
  if (!uri) {
    throw new Error('❌ Falta MONGODB_URI en el .env');
  }

  // Si ya hay una conexión establecida, reutilizarla
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay una promesa de conexión en curso, crear una
  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Aumentado a 10s para Vercel
      connectTimeoutMS: 10000, // Aumentado a 10s para Vercel
      socketTimeoutMS: 45000, // Timeout de socket
      maxPoolSize: 1, // En serverless, solo necesitamos 1 conexión
      minPoolSize: 1,
      retryWrites: true,
      w: 'majority',
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      const dbName = mongoose.connection.name;
      console.log(`✅ Conectado a MongoDB (${dbName})`);
      
      // Escuchar eventos del estado de la conexión
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  Se perdió la conexión con MongoDB');
        cached.conn = null;
        cached.promise = null;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔁 Reconectado a MongoDB');
      });

      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Error al conectar con MongoDB:', e.message);
    // En entornos serverless (Vercel), no hacer process.exit
    // Permitir que se reintente en la próxima invocación
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    if (process.env.NODE_ENV !== 'production' || !isVercel) {
      process.exit(1);
    }
    throw e;
  }

  return cached.conn;
}

export async function disconnectMongo() {
  try {
    await mongoose.disconnect();
    console.log('🛑 Conexión con MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error al desconectarse de MongoDB:', error.message);
  }
}
