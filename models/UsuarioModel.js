// models/UsuarioModel.js
// -------------------- MODELO DE USUARIO --------------------
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const UsuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    rol: {
      type: String,
      enum: ['administrador', 'productor', 'financiero', 'diseñador'],
      required: true,
      default: 'productor'
    },
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      required: true
    },
    activo: {
      type: Boolean,
      default: true
    },
    ultimoAcceso: {
      type: Date
    },
    intentosFallidos: {
      type: Number,
      default: 0
    },
    bloqueadoHasta: {
      type: Date
    },
    tokenRecuperacion: {
      type: String
    },
    tokenExpiracion: {
      type: Date
    }
  },
  { timestamps: true }
);

// -------------------- MIDDLEWARE PRE-SAVE: Hash de contraseña --------------------
UsuarioSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// -------------------- MÉTODO: Comparar contraseña --------------------
UsuarioSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// -------------------- MÉTODO: Verificar si está bloqueado --------------------
UsuarioSchema.methods.isBlocked = function () {
  if (this.bloqueadoHasta && this.bloqueadoHasta > new Date()) {
    return true;
  }
  return false;
};

// -------------------- MÉTODO: Incrementar intentos fallidos --------------------
UsuarioSchema.methods.incrementFailedAttempts = async function () {
  this.intentosFallidos += 1;
  
  // Bloquear después de 5 intentos fallidos por 30 minutos
  if (this.intentosFallidos >= 5) {
    this.bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
  }
  
  await this.save();
};

// -------------------- MÉTODO: Resetear intentos fallidos --------------------
UsuarioSchema.methods.resetFailedAttempts = async function () {
  this.intentosFallidos = 0;
  this.bloqueadoHasta = undefined;
  await this.save();
};

// -------------------- MÉTODO: Actualizar último acceso --------------------
UsuarioSchema.methods.updateLastAccess = async function () {
  this.ultimoAcceso = new Date();
  await this.save();
};

// -------------------- MODELO --------------------
const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  delete obj.password; // Nunca devolver la contraseña
  return obj;
}

// -------------------- CRUD --------------------
class UsuarioModel {
  async getAll() {
    try {
      const usuarios = await Usuario.find()
        .populate('empleado', 'nombre rol area email')
        .select('-password')
        .sort({ createdAt: -1 });
      return usuarios.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const usuario = await Usuario.findById(id)
        .populate('empleado', 'nombre rol area email')
        .select('-password');
      return toPlain(usuario);
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return null;
    }
  }

  async getByEmail(email) {
    try {
      const usuario = await Usuario.findOne({ email: email.toLowerCase() })
        .populate('empleado', 'nombre rol area email');
      return usuario; // No usar toPlain aquí porque necesitamos el password para comparar
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      return null;
    }
  }

  async add(usuario) {
    try {
      const nuevo = await Usuario.create({
        email: usuario.email.toLowerCase(),
        password: usuario.password, // Se hasheará automáticamente
        rol: usuario.rol,
        empleado: usuario.empleado,
        activo: usuario.activo !== undefined ? usuario.activo : true
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      return null;
    }
  }

  async update(id, usuario) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const updateData = { ...usuario };
      // Si se actualiza la contraseña, se hasheará automáticamente
      if (updateData.password) {
        // El pre-save se encargará del hash
      }
      const actualizado = await Usuario.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      }).populate('empleado', 'nombre rol area email').select('-password');
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Usuario.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      ).populate('empleado', 'nombre rol area email').select('-password');
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente usuario:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Usuario.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return null;
    }
  }

  async setRecoveryToken(email, token, expiration) {
    try {
      await Usuario.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          tokenRecuperacion: token,
          tokenExpiracion: expiration
        }
      );
      return true;
    } catch (error) {
      console.error('Error al establecer token de recuperación:', error);
      return false;
    }
  }

  async getByRecoveryToken(token) {
    try {
      const usuario = await Usuario.findOne({
        tokenRecuperacion: token,
        tokenExpiracion: { $gt: new Date() }
      }).populate('empleado', 'nombre rol area email');
      return usuario;
    } catch (error) {
      console.error('Error al obtener usuario por token:', error);
      return null;
    }
  }
}

export default new UsuarioModel();

