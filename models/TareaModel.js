//
// -------------------- MODELO DE TAREA --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
// Define la estructura de los documentos en la colección "tareas".
const TareaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    estado: {
      type: String,
      enum: ['pendiente', 'en proceso', 'finalizada'],
      default: 'pendiente',
    },
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta'],
      default: 'media',
    },
    area: {
      type: String,
      enum: ['Producción y Logística', 'Planificación y Finanzas'],
      required: true,
    },
    tipo: { type: String, trim: true, required: true },
    empleadoAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
    eventoAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
    horasEstimadas: { type: Number, default: 0 },
    horasReales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// -------------------- MODELO --------------------
const Tarea = mongoose.models.Tarea || mongoose.model('Tarea', TareaSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class TareaModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.eventoAsignado) query.eventoAsignado = filtros.eventoAsignado;
      if (filtros.empleadoAsignado) query.empleadoAsignado = filtros.empleadoAsignado;
      if (filtros.estado) query.estado = filtros.estado;
      if (filtros.area) query.area = filtros.area;
      if (filtros.prioridad) query.prioridad = filtros.prioridad;

      const tareas = await Tarea.find(query)
        .sort({ createdAt: -1 })
        .populate('empleadoAsignado', 'nombre rol area email')
        .populate('eventoAsignado', 'nombre lugar descripcion fechaInicio fechaFin estado');
      return tareas.map(toPlain);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const tarea = await Tarea.findById(id)
        .populate('empleadoAsignado', 'nombre rol area email')
        .populate('eventoAsignado', 'nombre lugar descripcion');
      return toPlain(tarea);
    } catch (error) {
      console.error('Error al obtener tarea por ID:', error);
      return null;
    }
  }

  async add(tarea) {
    try {
      const nueva = await Tarea.create({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || '',
        estado: tarea.estado || 'pendiente',
        fechaInicio: tarea.fechaInicio || null,
        fechaFin: tarea.fechaFin || null,
        prioridad: tarea.prioridad || 'media',
        area: tarea.area,
        tipo: tarea.tipo,
        empleadoAsignado: tarea.empleadoAsignado || null,
        eventoAsignado: tarea.eventoAsignado || null,
        horasEstimadas: Number(tarea.horasEstimadas) || 0,
        horasReales: Number(tarea.horasReales) || 0,
      });
      return toPlain(nueva);
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      return null;
    }
  }

  async update(id, tarea) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Tarea.findByIdAndUpdate(id, tarea, {
        new: true,
        runValidators: true,
      });
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Tarea.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      );
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente tarea:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Tarea.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      return null;
    }
  }
}

export default new TareaModel();
