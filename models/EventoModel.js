//
// -------------------- MODELO DE EVENTO --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const EventoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    lugar: { type: String, trim: true },
    presupuesto: { type: Number, default: 0 },
    estado: {
      type: String,
      enum: ['planificacion', 'en_curso', 'ejecutado', 'cerrado', 'cancelado'],
      default: 'planificacion'
    },
    responsables: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado'
    }],
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente'
    }
  },
  { timestamps: true }
);

// -------------------- MODELO --------------------
const Evento = mongoose.models.Evento || mongoose.model('Evento', EventoSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class EventoModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.estado) query.estado = filtros.estado;
      if (filtros.cliente) query.cliente = filtros.cliente;
      if (filtros.responsable) query.responsables = filtros.responsable;

      const eventos = await Evento.find(query)
        .populate('responsables', 'nombre rol area email')
        .populate('cliente', 'nombre email telefono')
        .sort({ fechaInicio: -1 });
      return eventos.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const evento = await Evento.findById(id)
        .populate('responsables', 'nombre rol area email telefono')
        .populate('cliente', 'nombre email telefono direccion');
      return toPlain(evento);
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      return null;
    }
  }

  async add(evento) {
    try {
      const nuevo = await Evento.create({
        nombre: evento.nombre,
        descripcion: evento.descripcion || '',
        fechaInicio: evento.fechaInicio || null,
        fechaFin: evento.fechaFin || null,
        lugar: evento.lugar || '',
        presupuesto: Number(evento.presupuesto) || 0,
        estado: evento.estado || 'planificacion',
        responsables: evento.responsables || [],
        cliente: evento.cliente || null
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar evento:', error);
      return null;
    }
  }

  async update(id, evento) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Evento.findByIdAndUpdate(id, evento, {
        new: true,
        runValidators: true,
      })
        .populate('responsables', 'nombre rol area email')
        .populate('cliente', 'nombre email telefono');
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Evento.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('responsables', 'nombre rol area email')
        .populate('cliente', 'nombre email telefono');
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente evento:', error);
      return null;
    }
  }

  async agregarResponsable(eventoId, empleadoId) {
    if (!mongoose.isValidObjectId(eventoId) || !mongoose.isValidObjectId(empleadoId)) return null;
    try {
      const actualizado = await Evento.findByIdAndUpdate(
        eventoId,
        { $addToSet: { responsables: empleadoId } },
        { new: true, runValidators: true }
      )
        .populate('responsables', 'nombre rol area email');
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al agregar responsable:', error);
      return null;
    }
  }

  async removerResponsable(eventoId, empleadoId) {
    if (!mongoose.isValidObjectId(eventoId) || !mongoose.isValidObjectId(empleadoId)) return null;
    try {
      const actualizado = await Evento.findByIdAndUpdate(
        eventoId,
        { $pull: { responsables: empleadoId } },
        { new: true, runValidators: true }
      )
        .populate('responsables', 'nombre rol area email');
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al remover responsable:', error);
      return null;
    }
  }

  async cambiarEstado(eventoId, nuevoEstado) {
    if (!mongoose.isValidObjectId(eventoId)) return null;
    const estadosValidos = ['planificacion', 'en_curso', 'ejecutado', 'cerrado', 'cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) return null;
    
    try {
      const actualizado = await Evento.findByIdAndUpdate(
        eventoId,
        { estado: nuevoEstado },
        { new: true, runValidators: true }
      )
        .populate('responsables', 'nombre rol area email')
        .populate('cliente', 'nombre email telefono');
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Evento.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      return null;
    }
  }
}

export default new EventoModel();



