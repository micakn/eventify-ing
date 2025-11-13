// models/InvitadoModel.js
// -------------------- MODELO DE INVITADO --------------------
import mongoose from 'mongoose';
import crypto from 'crypto';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const InvitadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    telefono: {
      type: String,
      trim: true
    },
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evento',
      required: true
    },
    estadoRSVP: {
      type: String,
      enum: ['pendiente', 'confirmado', 'rechazado', 'talvez'],
      default: 'pendiente'
    },
    codigoQR: {
      type: String
    },
    fechaConfirmacion: {
      type: Date
    },
    fechaCheckIn: {
      type: Date
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    notas: {
      type: String,
      trim: true
    },
    categoria: {
      type: String,
      enum: ['VIP', 'Estándar', 'Staff', 'Prensa'],
      default: 'Estándar'
    },
    mesa: {
      type: String,
      trim: true
    },
    acompanantes: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

// -------------------- MIDDLEWARE PRE-SAVE: Generar código QR --------------------
InvitadoSchema.pre('save', async function (next) {
  // Generar código QR único si no existe y el invitado está confirmado
  if (!this.codigoQR && this.estadoRSVP === 'confirmado') {
    const codigo = crypto.randomBytes(16).toString('hex');
    this.codigoQR = `QR-${this.evento}-${codigo}`;
  }
  next();
});

// -------------------- ÍNDICES --------------------
InvitadoSchema.index({ email: 1, evento: 1 }, { unique: true });
InvitadoSchema.index({ codigoQR: 1 }, { sparse: true });
InvitadoSchema.index({ evento: 1 });
InvitadoSchema.index({ estadoRSVP: 1 });

// -------------------- MODELO --------------------
const Invitado = mongoose.models.Invitado || mongoose.model('Invitado', InvitadoSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class InvitadoModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.evento) query.evento = filtros.evento;
      if (filtros.estadoRSVP) query.estadoRSVP = filtros.estadoRSVP;
      if (filtros.categoria) query.categoria = filtros.categoria;
      if (filtros.checkedIn !== undefined) query.checkedIn = filtros.checkedIn;

      const invitados = await Invitado.find(query)
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .sort({ apellido: 1, nombre: 1 });
      
      return invitados.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los invitados:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const invitado = await Invitado.findById(id)
        .populate('evento', 'nombre fechaInicio fechaFin lugar descripcion');
      return toPlain(invitado);
    } catch (error) {
      console.error('Error al obtener invitado por ID:', error);
      return null;
    }
  }

  async getByEmail(email, eventoId) {
    try {
      const invitado = await Invitado.findOne({
        email: email.toLowerCase(),
        evento: eventoId
      }).populate('evento', 'nombre fechaInicio fechaFin lugar');
      return invitado ? toPlain(invitado) : null;
    } catch (error) {
      console.error('Error al obtener invitado por email:', error);
      return null;
    }
  }

  async getByCodigoQR(codigoQR) {
    try {
      const invitado = await Invitado.findOne({ codigoQR })
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      return invitado ? toPlain(invitado) : null;
    } catch (error) {
      console.error('Error al obtener invitado por código QR:', error);
      return null;
    }
  }

  async getByEvento(eventoId) {
    try {
      const invitados = await Invitado.find({ evento: eventoId })
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .sort({ apellido: 1, nombre: 1 });
      return invitados.map(toPlain);
    } catch (error) {
      console.error('Error al obtener invitados por evento:', error);
      return [];
    }
  }

  async getEstadisticas(eventoId) {
    try {
      const invitados = await Invitado.find({ evento: eventoId });
      
      const estadisticas = {
        total: invitados.length,
        confirmados: invitados.filter(i => i.estadoRSVP === 'confirmado').length,
        pendientes: invitados.filter(i => i.estadoRSVP === 'pendiente').length,
        rechazados: invitados.filter(i => i.estadoRSVP === 'rechazado').length,
        talvez: invitados.filter(i => i.estadoRSVP === 'talvez').length,
        checkedIn: invitados.filter(i => i.checkedIn === true).length,
        noShow: invitados.filter(i => i.estadoRSVP === 'confirmado' && !i.checkedIn).length,
        totalAcompanantes: invitados.reduce((sum, i) => sum + (i.acompanantes || 0), 0),
        totalAsistentes: invitados.filter(i => i.checkedIn === true).length + 
                        invitados.reduce((sum, i) => sum + (i.checkedIn ? (i.acompanantes || 0) : 0), 0)
      };

      return estadisticas;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return null;
    }
  }

  async add(invitado) {
    try {
      const nuevo = await Invitado.create({
        nombre: invitado.nombre,
        apellido: invitado.apellido || '',
        email: invitado.email.toLowerCase(),
        telefono: invitado.telefono || '',
        evento: invitado.evento,
        estadoRSVP: invitado.estadoRSVP || 'pendiente',
        categoria: invitado.categoria || 'Estándar',
        notas: invitado.notas || '',
        acompanantes: invitado.acompanantes || 0,
        mesa: invitado.mesa || ''
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar invitado:', error);
      return null;
    }
  }

  async addMultiple(invitados) {
    try {
      // Validar que no haya duplicados
      const emails = invitados.map(i => i.email.toLowerCase());
      const duplicados = await Invitado.find({
        email: { $in: emails },
        evento: invitados[0]?.evento
      });

      if (duplicados.length > 0) {
        throw new Error(`Existen ${duplicados.length} invitados duplicados`);
      }

      const creados = await Invitado.insertMany(invitados);
      return creados.map(toPlain);
    } catch (error) {
      console.error('Error al agregar invitados múltiples:', error);
      return null;
    }
  }

  async update(id, invitado) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Invitado.findByIdAndUpdate(id, invitado, {
        new: true,
        runValidators: true
      })
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar invitado:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Si se actualiza el estado a confirmado, generar QR si no existe
      if (campos.estadoRSVP === 'confirmado') {
        const invitado = await Invitado.findById(id);
        if (!invitado.codigoQR) {
          const codigo = crypto.randomBytes(16).toString('hex');
          campos.codigoQR = `QR-${invitado.evento}-${codigo}`;
        }
        if (!campos.fechaConfirmacion) {
          campos.fechaConfirmacion = new Date();
        }
      }

      const actualizado = await Invitado.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente invitado:', error);
      return null;
    }
  }

  async confirmarRSVP(codigoUnico, estado) {
    try {
      const invitado = await Invitado.findOne({ codigoQR: codigoUnico });
      if (!invitado) {
        return null;
      }

      const campos = {
        estadoRSVP: estado,
        fechaConfirmacion: new Date()
      };

      // Si se confirma, generar QR si no existe
      if (estado === 'confirmado' && !invitado.codigoQR) {
        const codigo = crypto.randomBytes(16).toString('hex');
        campos.codigoQR = `QR-${invitado.evento}-${codigo}`;
      }

      const actualizado = await Invitado.findByIdAndUpdate(
        invitado._id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al confirmar RSVP:', error);
      return null;
    }
  }

  async checkIn(codigoQR) {
    try {
      const invitado = await Invitado.findOne({ codigoQR });
      if (!invitado) {
        return { success: false, mensaje: 'Código QR no válido' };
      }

      if (invitado.checkedIn) {
        return { success: false, mensaje: 'Invitado ya registró su asistencia', invitado: toPlain(invitado) };
      }

      if (invitado.estadoRSVP !== 'confirmado') {
        return { success: false, mensaje: 'Invitado no confirmó su asistencia', invitado: toPlain(invitado) };
      }

      const actualizado = await Invitado.findByIdAndUpdate(
        invitado._id,
        {
          checkedIn: true,
          fechaCheckIn: new Date()
        },
        { new: true, runValidators: true }
      )
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      
      return { success: true, invitado: toPlain(actualizado) };
    } catch (error) {
      console.error('Error al hacer check-in:', error);
      return { success: false, mensaje: 'Error al registrar asistencia' };
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Invitado.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar invitado:', error);
      return null;
    }
  }

  async removeByEvento(eventoId) {
    try {
      const eliminados = await Invitado.deleteMany({ evento: eventoId });
      return eliminados.deletedCount;
    } catch (error) {
      console.error('Error al eliminar invitados por evento:', error);
      return 0;
    }
  }
}

export default new InvitadoModel();

