// models/InvitacionModel.js
// -------------------- MODELO DE INVITACIÓN (RSVP) --------------------
import mongoose from 'mongoose';
import crypto from 'crypto';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const InvitacionSchema = new mongoose.Schema(
  {
    invitado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invitado',
      required: true
    },
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evento',
      required: true
    },
    enlaceUnico: {
      type: String,
      required: true,
      unique: true
    },
    fechaEnvio: {
      type: Date,
      default: Date.now
    },
    fechaRespuesta: {
      type: Date
    },
    estado: {
      type: String,
      enum: ['enviada', 'abierta', 'respondida', 'expirada'],
      default: 'enviada'
    },
    respuesta: {
      type: String,
      enum: ['confirmado', 'rechazado', 'talvez'],
      default: null
    },
    intentosEnvio: {
      type: Number,
      default: 0
    },
    ultimoIntentoEnvio: {
      type: Date
    },
    expiracion: {
      type: Date
    }
  },
  { timestamps: true }
);

// -------------------- MIDDLEWARE PRE-SAVE: Generar enlace único --------------------
InvitacionSchema.pre('save', async function (next) {
  if (!this.enlaceUnico) {
    const token = crypto.randomBytes(32).toString('hex');
    this.enlaceUnico = `RSVP-${this.evento}-${token}`;
  }
  next();
});

// -------------------- ÍNDICES --------------------
InvitacionSchema.index({ invitado: 1, evento: 1 }, { unique: true });
InvitacionSchema.index({ enlaceUnico: 1 });
InvitacionSchema.index({ evento: 1 });
InvitacionSchema.index({ estado: 1 });

// -------------------- MODELO --------------------
const Invitacion = mongoose.models.Invitacion || mongoose.model('Invitacion', InvitacionSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class InvitacionModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.evento) query.evento = filtros.evento;
      if (filtros.estado) query.estado = filtros.estado;
      if (filtros.respuesta) query.respuesta = filtros.respuesta;

      const invitaciones = await Invitacion.find(query)
        .populate('invitado', 'nombre apellido email estadoRSVP')
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .sort({ fechaEnvio: -1 });
      
      return invitaciones.map(toPlain);
    } catch (error) {
      console.error('Error al obtener las invitaciones:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const invitacion = await Invitacion.findById(id)
        .populate('invitado', 'nombre apellido email telefono estadoRSVP categoria')
        .populate('evento', 'nombre descripcion fechaInicio fechaFin lugar');
      return toPlain(invitacion);
    } catch (error) {
      console.error('Error al obtener invitacion por ID:', error);
      return null;
    }
  }

  async getByEnlaceUnico(enlaceUnico) {
    try {
      const invitacion = await Invitacion.findOne({ enlaceUnico })
        .populate('invitado', 'nombre apellido email telefono estadoRSVP categoria')
        .populate('evento', 'nombre descripcion fechaInicio fechaFin lugar');
      return invitacion ? toPlain(invitacion) : null;
    } catch (error) {
      console.error('Error al obtener invitacion por enlace:', error);
      return null;
    }
  }

  async getByInvitado(invitadoId) {
    try {
      const invitacion = await Invitacion.findOne({ invitado: invitadoId })
        .populate('invitado', 'nombre apellido email estadoRSVP')
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      return invitacion ? toPlain(invitacion) : null;
    } catch (error) {
      console.error('Error al obtener invitacion por invitado:', error);
      return null;
    }
  }

  async getByEvento(eventoId) {
    try {
      const invitaciones = await Invitacion.find({ evento: eventoId })
        .populate('invitado', 'nombre apellido email estadoRSVP')
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .sort({ fechaEnvio: -1 });
      return invitaciones.map(toPlain);
    } catch (error) {
      console.error('Error al obtener invitaciones por evento:', error);
      return [];
    }
  }

  async add(invitacion) {
    try {
      const nueva = await Invitacion.create({
        invitado: invitacion.invitado,
        evento: invitacion.evento,
        fechaEnvio: invitacion.fechaEnvio || new Date(),
        expiracion: invitacion.expiracion || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      });
      return toPlain(nueva);
    } catch (error) {
      console.error('Error al agregar invitacion:', error);
      return null;
    }
  }

  async addMultiple(invitaciones) {
    try {
      const creadas = await Invitacion.insertMany(invitaciones);
      return creadas.map(toPlain);
    } catch (error) {
      console.error('Error al agregar invitaciones múltiples:', error);
      return [];
    }
  }

  async responder(enlaceUnico, respuesta) {
    try {
      const invitacion = await Invitacion.findOne({ enlaceUnico });
      if (!invitacion) {
        return null;
      }

      // Verificar si no está expirada
      if (invitacion.expiracion && invitacion.expiracion < new Date()) {
        await Invitacion.findByIdAndUpdate(invitacion._id, { estado: 'expirada' });
        return { error: 'La invitación ha expirado' };
      }

      const actualizada = await Invitacion.findByIdAndUpdate(
        invitacion._id,
        {
          estado: 'respondida',
          respuesta,
          fechaRespuesta: new Date()
        },
        { new: true, runValidators: true }
      )
        .populate('invitado', 'nombre apellido email')
        .populate('evento', 'nombre fechaInicio fechaFin lugar');

      // Actualizar estado RSVP del invitado
      if (actualizada && actualizada.invitado) {
        const InvitadoModel = (await import('./InvitadoModel.js')).default;
        // Obtener ID del invitado (puede ser objeto o ID)
        const invitadoId = typeof actualizada.invitado === 'object' 
          ? (actualizada.invitado.id || actualizada.invitado._id || String(actualizada.invitado))
          : String(actualizada.invitado);
        
        if (invitadoId && invitadoId !== 'null' && invitadoId !== 'undefined') {
          await InvitadoModel.patch(invitadoId, {
            estadoRSVP: respuesta,
            fechaConfirmacion: new Date()
          });
        }
      }

      return actualizada ? toPlain(actualizada) : null;
    } catch (error) {
      console.error('Error al responder invitación:', error);
      return null;
    }
  }

  async marcarComoAbierta(enlaceUnico) {
    try {
      const actualizada = await Invitacion.findOneAndUpdate(
        { enlaceUnico, estado: 'enviada' },
        { estado: 'abierta' },
        { new: true }
      );
      return actualizada ? toPlain(actualizada) : null;
    } catch (error) {
      console.error('Error al marcar como abierta:', error);
      return null;
    }
  }

  async incrementarIntentoEnvio(invitacionId) {
    try {
      await Invitacion.findByIdAndUpdate(invitacionId, {
        $inc: { intentosEnvio: 1 },
        ultimoIntentoEnvio: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error al incrementar intento de envío:', error);
      return false;
    }
  }

  async update(id, invitacion) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizada = await Invitacion.findByIdAndUpdate(id, invitacion, {
        new: true,
        runValidators: true
      })
        .populate('invitado', 'nombre apellido email estadoRSVP')
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      
      return actualizada ? toPlain(actualizada) : null;
    } catch (error) {
      console.error('Error al actualizar invitacion:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminada = await Invitacion.findByIdAndDelete(id);
      return eliminada ? toPlain(eliminada) : null;
    } catch (error) {
      console.error('Error al eliminar invitacion:', error);
      return null;
    }
  }

  async removeByEvento(eventoId) {
    try {
      const eliminadas = await Invitacion.deleteMany({ evento: eventoId });
      return eliminadas.deletedCount;
    } catch (error) {
      console.error('Error al eliminar invitaciones por evento:', error);
      return 0;
    }
  }

  async removeByInvitado(invitadoId) {
    try {
      const eliminada = await Invitacion.findOneAndDelete({ invitado: invitadoId });
      return eliminada ? toPlain(eliminada) : null;
    } catch (error) {
      console.error('Error al eliminar invitación por invitado:', error);
      return null;
    }
  }
}

export default new InvitacionModel();

