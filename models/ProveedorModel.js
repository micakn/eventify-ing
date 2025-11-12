// models/ProveedorModel.js
// -------------------- MODELO DE PROVEEDOR --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const ProveedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    contacto: {
      nombre: { type: String, trim: true },
      email: { type: String, lowercase: true, trim: true },
      telefono: { type: String, trim: true }
    },
    servicios: [{
      type: String,
      trim: true
    }],
    tarifasReferencia: [{
      servicio: { type: String, trim: true },
      precio: { type: Number, min: 0 },
      unidad: { type: String, trim: true }, // "por hora", "por evento", "por persona", etc.
      fechaActualizacion: { type: Date, default: Date.now }
    }],
    condicionImpositiva: {
      type: String,
      enum: ['Responsable Inscripto', 'Monotributo', 'Exento', 'No Responsable'],
      default: 'Responsable Inscripto'
    },
    CUIT: {
      type: String,
      trim: true
    },
    direccion: {
      type: String,
      trim: true
    },
    notas: {
      type: String,
      trim: true
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// -------------------- ÍNDICES --------------------
ProveedorSchema.index({ nombre: 1 });
ProveedorSchema.index({ 'contacto.email': 1 });

// -------------------- MODELO --------------------
const Proveedor = mongoose.models.Proveedor || mongoose.model('Proveedor', ProveedorSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class ProveedorModel {
  async getAll() {
    try {
      const proveedores = await Proveedor.find({ activo: true })
        .sort({ nombre: 1 });
      return proveedores.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const proveedor = await Proveedor.findById(id);
      return toPlain(proveedor);
    } catch (error) {
      console.error('Error al obtener proveedor por ID:', error);
      return null;
    }
  }

  async add(proveedor) {
    try {
      const nuevo = await Proveedor.create({
        nombre: proveedor.nombre,
        contacto: proveedor.contacto || {},
        servicios: proveedor.servicios || [],
        tarifasReferencia: proveedor.tarifasReferencia || [],
        condicionImpositiva: proveedor.condicionImpositiva || 'Responsable Inscripto',
        CUIT: proveedor.CUIT || '',
        direccion: proveedor.direccion || '',
        notas: proveedor.notas || '',
        activo: proveedor.activo !== undefined ? proveedor.activo : true
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
      return null;
    }
  }

  async update(id, proveedor) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Proveedor.findByIdAndUpdate(id, proveedor, {
        new: true,
        runValidators: true
      });
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Proveedor.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      );
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente proveedor:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Soft delete: marcar como inactivo
      const eliminado = await Proveedor.findByIdAndUpdate(
        id,
        { activo: false },
        { new: true }
      );
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      return null;
    }
  }

  async getByServicio(servicio) {
    try {
      const proveedores = await Proveedor.find({
        activo: true,
        servicios: { $in: [new RegExp(servicio, 'i')] }
      }).sort({ nombre: 1 });
      return proveedores.map(toPlain);
    } catch (error) {
      console.error('Error al buscar proveedores por servicio:', error);
      return [];
    }
  }
}

export default new ProveedorModel();

