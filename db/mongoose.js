// db/mongoose.js
import mongoose from 'mongoose';

// Cachear la conexión para reutilizar entre invocaciones
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
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
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
