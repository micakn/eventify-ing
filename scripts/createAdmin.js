// scripts/createAdmin.js
// -------------------- SCRIPT PARA CREAR USUARIO ADMINISTRADOR INICIAL --------------------
import dotenv from 'dotenv';
import { connectMongo, disconnectMongo } from '../db/mongoose.js';
import UsuarioModel from '../models/UsuarioModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';

dotenv.config();

async function createAdmin() {
  try {
    await connectMongo(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar o crear un empleado administrador
    let empleadoAdmin = await EmpleadoModel.getAll();
    empleadoAdmin = empleadoAdmin.find(e => e.rol === 'administrador');

    if (!empleadoAdmin) {
      console.log('⚠️  No se encontró un empleado con rol administrador');
      console.log('💡 Creando empleado administrador...');
      
      empleadoAdmin = await EmpleadoModel.add({
        nombre: 'Administrador Sistema',
        rol: 'administrador',
        area: 'Administración',
        email: 'admin@eventify.com',
        telefono: '+5491100000000'
      });
      
      console.log('✅ Empleado administrador creado:', empleadoAdmin.id);
    }

    // Verificar si ya existe un usuario admin
    const usuarioExistente = await UsuarioModel.getByEmail('admin@eventify.com');
    
    if (usuarioExistente) {
      console.log('⚠️  Ya existe un usuario con email admin@eventify.com');
      console.log('💡 Si deseas crear otro, cambia el email en el script');
      await disconnectMongo();
      return;
    }

    // Crear usuario administrador
    const adminUsuario = await UsuarioModel.add({
      email: 'admin@eventify.com',
      password: 'admin123', // Cambiar en producción
      rol: 'administrador',
      empleado: empleadoAdmin.id,
      activo: true
    });

    if (adminUsuario) {
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email: admin@eventify.com');
      console.log('🔑 Contraseña: admin123');
      console.log('⚠️  IMPORTANTE: Cambiar la contraseña después del primer login');
    } else {
      console.error('❌ Error al crear usuario administrador');
    }

    await disconnectMongo();
    console.log('🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();

