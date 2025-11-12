// models/ItemCotizacionModel.js
// -------------------- MODELO DE ITEM DE COTIZACIÓN --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const ItemCotizacionSchema = new mongoose.Schema(
  {
    cotizacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cotizacion',
      required: true
    },
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proveedor',
      required: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: String,
      trim: true,
      enum: ['Catering', 'Sonido', 'Iluminación', 'Decoración', 'Logística', 'Otros'],
      default: 'Otros'
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0.01
    },
    unidad: {
      type: String,
      trim: true,
      default: 'unidad'
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0
    },
    observaciones: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// -------------------- MIDDLEWARE PRE-SAVE: Calcular subtotal --------------------
ItemCotizacionSchema.pre('save', function (next) {
  this.subtotal = this.cantidad * this.precioUnitario;
  next();
});

// -------------------- ÍNDICES --------------------
ItemCotizacionSchema.index({ cotizacion: 1 });
ItemCotizacionSchema.index({ proveedor: 1 });

// -------------------- MODELO --------------------
const ItemCotizacion = mongoose.models.ItemCotizacion || mongoose.model('ItemCotizacion', ItemCotizacionSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class ItemCotizacionModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.cotizacion) query.cotizacion = filtros.cotizacion;
      if (filtros.proveedor) query.proveedor = filtros.proveedor;

      const items = await ItemCotizacion.find(query)
        .populate('proveedor', 'nombre contacto')
        .populate('cotizacion', 'numero estado')
        .sort({ createdAt: 1 });
      
      return items.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los items:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const item = await ItemCotizacion.findById(id)
        .populate('proveedor', 'nombre contacto servicios')
        .populate('cotizacion', 'numero estado cliente evento');
      return toPlain(item);
    } catch (error) {
      console.error('Error al obtener item por ID:', error);
      return null;
    }
  }

  async getByCotizacion(cotizacionId) {
    try {
      const items = await ItemCotizacion.find({ cotizacion: cotizacionId })
        .populate('proveedor', 'nombre contacto')
        .sort({ createdAt: 1 });
      return items.map(toPlain);
    } catch (error) {
      console.error('Error al obtener items por cotización:', error);
      return [];
    }
  }

  async add(item) {
    try {
      const nuevo = await ItemCotizacion.create({
        cotizacion: item.cotizacion,
        proveedor: item.proveedor,
        descripcion: item.descripcion,
        categoria: item.categoria || 'Otros',
        cantidad: Number(item.cantidad),
        unidad: item.unidad || 'unidad',
        precioUnitario: Number(item.precioUnitario),
        observaciones: item.observaciones || ''
      });
      
      // El subtotal se calcula automáticamente en el pre-save
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar item:', error);
      return null;
    }
  }

  async addMultiple(items) {
    try {
      const creados = await ItemCotizacion.insertMany(items);
      return creados.map(toPlain);
    } catch (error) {
      console.error('Error al agregar items múltiples:', error);
      return [];
    }
  }

  async update(id, item) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await ItemCotizacion.findByIdAndUpdate(id, item, {
        new: true,
        runValidators: true
      })
        .populate('proveedor', 'nombre contacto')
        .populate('cotizacion', 'numero estado');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar item:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await ItemCotizacion.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('proveedor', 'nombre contacto')
        .populate('cotizacion', 'numero estado');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente item:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await ItemCotizacion.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar item:', error);
      return null;
    }
  }

  async removeByCotizacion(cotizacionId) {
    try {
      const eliminados = await ItemCotizacion.deleteMany({ cotizacion: cotizacionId });
      return eliminados.deletedCount;
    } catch (error) {
      console.error('Error al eliminar items por cotización:', error);
      return 0;
    }
  }
}

export default new ItemCotizacionModel();

