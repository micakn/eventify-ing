// db/mongoose.js
import mongoose from 'mongoose';

export async function connectMongo(uri) {
  if (!uri) throw new Error('❌ Falta MONGODB_URI en el .env');

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    const dbName = mongoose.connection.name;
    console.log(`✅ Conectado a MongoDB (${dbName})`);

    // Escuchar eventos del estado de la conexión
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  Se perdió la conexión con MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔁 Reconectado a MongoDB');
    });
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}

export async function disconnectMongo() {
  try {
    await mongoose.disconnect();
    console.log('🛑 Conexión con MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error al desconectarse de MongoDB:', error.message);
  }
}
