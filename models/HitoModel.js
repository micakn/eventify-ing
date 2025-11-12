// models/HitoModel.js
// -------------------- MODELO DE HITO (CRONOGRAMA) --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const HitoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      trim: true
    },
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evento',
      required: true
    },
    fechaInicio: {
      type: Date,
      required: true
    },
    fechaFin: {
      type: Date,
      required: true
    },
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado'
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en_progreso', 'completado', 'atrasado', 'cancelado'],
      default: 'pendiente'
    },
    tipo: {
      type: String,
      enum: ['reunion', 'tarea', 'hito', 'revision', 'entrega'],
      default: 'hito'
    },
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta', 'critica'],
      default: 'media'
    },
    orden: {
      type: Number,
      default: 0
    },
    completado: {
      type: Boolean,
      default: false
    },
    fechaCompletado: {
      type: Date
    },
    notas: {
      type: String,
      trim: true
    },
    dependencias: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hito'
    }]
  },
  { timestamps: true }
);

// -------------------- ÍNDICES --------------------
HitoSchema.index({ evento: 1, fechaInicio: 1 });
HitoSchema.index({ evento: 1, estado: 1 });
HitoSchema.index({ responsable: 1 });
HitoSchema.index({ fechaInicio: 1, fechaFin: 1 });

// -------------------- MIDDLEWARE PRE-SAVE: Actualizar estado si está completado --------------------
HitoSchema.pre('save', function (next) {
  if (this.completado && !this.fechaCompletado) {
    this.fechaCompletado = new Date();
    this.estado = 'completado';
  }
  if (!this.completado && this.estado === 'completado') {
    this.fechaCompletado = null;
  }
  next();
});

// -------------------- MODELO --------------------
const Hito = mongoose.models.Hito || mongoose.model('Hito', HitoSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class HitoModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.evento) query.evento = filtros.evento;
      if (filtros.estado) query.estado = filtros.estado;
      if (filtros.responsable) query.responsable = filtros.responsable;
      if (filtros.tipo) query.tipo = filtros.tipo;
      if (filtros.completado !== undefined) query.completado = filtros.completado;

      const hitos = await Hito.find(query)
        .populate('evento', 'nombre fechaInicio fechaFin lugar estado')
        .populate('responsable', 'nombre rol area email')
        .populate('dependencias', 'nombre estado completado')
        .sort({ orden: 1, fechaInicio: 1 });
      
      return hitos.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los hitos:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const hito = await Hito.findById(id)
        .populate('evento', 'nombre fechaInicio fechaFin lugar estado descripcion')
        .populate('responsable', 'nombre rol area email telefono')
        .populate('dependencias', 'nombre estado completado fechaInicio fechaFin');
      return toPlain(hito);
    } catch (error) {
      console.error('Error al obtener hito por ID:', error);
      return null;
    }
  }

  async getByEvento(eventoId) {
    try {
      const hitos = await Hito.find({ evento: eventoId })
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('responsable', 'nombre rol area email')
        .populate('dependencias', 'nombre estado completado')
        .sort({ orden: 1, fechaInicio: 1 });
      return hitos.map(toPlain);
    } catch (error) {
      console.error('Error al obtener hitos por evento:', error);
      return [];
    }
  }

  async getCronogramaEvento(eventoId) {
    try {
      // Verificar que el evento existe
      const EventoModel = (await import('./EventoModel.js')).default;
      const evento = await EventoModel.getById(eventoId);
      if (!evento) {
        return null;
      }

      const hitos = await this.getByEvento(eventoId);
      const TareaModel = (await import('./TareaModel.js')).default;
      const tareas = await TareaModel.getAll({ eventoAsignado: eventoId });

      // Combinar hitos y tareas en un cronograma
      const cronograma = {
        hitos: hitos.map(hito => ({
          id: hito.id,
          nombre: hito.nombre,
          tipo: 'hito',
          fechaInicio: hito.fechaInicio,
          fechaFin: hito.fechaFin,
          estado: hito.estado,
          responsable: hito.responsable,
          prioridad: hito.prioridad,
          completado: hito.completado,
          descripcion: hito.descripcion
        })),
        tareas: tareas.map(tarea => ({
          id: tarea.id,
          nombre: tarea.titulo,
          tipo: 'tarea',
          fechaInicio: tarea.fechaInicio,
          fechaFin: tarea.fechaFin,
          estado: tarea.estado,
          responsable: tarea.empleadoAsignado,
          prioridad: tarea.prioridad,
          completado: tarea.estado === 'finalizada',
          descripcion: tarea.descripcion
        }))
      };

      // Ordenar por fecha
      const todos = [...cronograma.hitos, ...cronograma.tareas].sort((a, b) => {
        const fechaA = a.fechaInicio ? new Date(a.fechaInicio) : new Date(0);
        const fechaB = b.fechaInicio ? new Date(b.fechaInicio) : new Date(0);
        return fechaA - fechaB;
      });

      cronograma.timeline = todos;
      
      return cronograma;
    } catch (error) {
      console.error('Error al obtener cronograma:', error);
      return null;
    }
  }

  async add(hito) {
    try {
      const nuevo = await Hito.create({
        nombre: hito.nombre,
        descripcion: hito.descripcion || '',
        evento: hito.evento,
        fechaInicio: hito.fechaInicio,
        fechaFin: hito.fechaFin,
        responsable: hito.responsable || null,
        estado: hito.estado || 'pendiente',
        tipo: hito.tipo || 'hito',
        prioridad: hito.prioridad || 'media',
        orden: hito.orden || 0,
        dependencias: hito.dependencias || [],
        notas: hito.notas || ''
      });
      
      const hitoCompleto = await this.getById(nuevo._id);
      return hitoCompleto;
    } catch (error) {
      console.error('Error al agregar hito:', error);
      return null;
    }
  }

  async update(id, hito) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Hito.findByIdAndUpdate(id, hito, {
        new: true,
        runValidators: true
      })
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('responsable', 'nombre rol area email')
        .populate('dependencias', 'nombre estado completado');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar hito:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Si se marca como completado, actualizar estado y fecha
      if (campos.completado === true) {
        campos.estado = 'completado';
        campos.fechaCompletado = new Date();
      } else if (campos.completado === false && campos.estado === 'completado') {
        campos.estado = 'pendiente';
        campos.fechaCompletado = null;
      }

      const actualizado = await Hito.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('responsable', 'nombre rol area email')
        .populate('dependencias', 'nombre estado completado');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente hito:', error);
      return null;
    }
  }

  async completar(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Hito.findByIdAndUpdate(
        id,
        {
          completado: true,
          estado: 'completado',
          fechaCompletado: new Date()
        },
        { new: true, runValidators: true }
      )
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('responsable', 'nombre rol area email');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al completar hito:', error);
      return null;
    }
  }

  async remover(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Hito.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar hito:', error);
      return null;
    }
  }

  async removerPorEvento(eventoId) {
    try {
      const eliminados = await Hito.deleteMany({ evento: eventoId });
      return eliminados.deletedCount;
    } catch (error) {
      console.error('Error al eliminar hitos por evento:', error);
      return 0;
    }
  }

  async actualizarEstadosAtrasados() {
    try {
      const ahora = new Date();
      const actualizados = await Hito.updateMany(
        {
          estado: { $in: ['pendiente', 'en_progreso'] },
          fechaFin: { $lt: ahora },
          completado: false
        },
        {
          $set: { estado: 'atrasado' }
        }
      );
      return actualizados.modifiedCount;
    } catch (error) {
      console.error('Error al actualizar estados atrasados:', error);
      return 0;
    }
  }
}

export default new HitoModel();

