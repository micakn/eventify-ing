// server.js
// -------------------- SERVIDOR DE PRODUCCIÓN --------------------
import app from './app.js';
import { connectMongo } from './db/mongoose.js';

const PORT = process.env.PORT || 3000;

// Iniciar servidor SOLO tras conectar a Mongo
connectMongo(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a Mongo:', err);
    process.exit(1);
  });

