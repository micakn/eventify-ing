// models/ItemFacturaModel.js
// -------------------- MODELO DE ITEM DE FACTURA --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const ItemFacturaSchema = new mongoose.Schema(
  {
    factura: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacturaCliente',
      required: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: String,
      enum: ['Catering', 'Sonido', 'Iluminación', 'Decoración', 'Logística', 'Servicios', 'Otros'],
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    iva: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    orden: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// -------------------- ÍNDICES --------------------
ItemFacturaSchema.index({ factura: 1, orden: 1 });
ItemFacturaSchema.index({ categoria: 1 });

// -------------------- MIDDLEWARE PRE-SAVE: Calcular subtotal y total --------------------
ItemFacturaSchema.pre('save', function (next) {
  if (this.isModified('cantidad') || this.isModified('precioUnitario')) {
    this.subtotal = this.cantidad * this.precioUnitario;
    this.total = this.subtotal + (this.iva || 0);
  }
  if (this.isModified('subtotal') || this.isModified('iva')) {
    this.total = this.subtotal + (this.iva || 0);
  }
  next();
});

// -------------------- MODELO --------------------
const ItemFactura = mongoose.models.ItemFactura || mongoose.model('ItemFactura', ItemFacturaSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class ItemFacturaModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.factura) query.factura = filtros.factura;
      if (filtros.categoria) query.categoria = filtros.categoria;

      const items = await ItemFactura.find(query)
        .populate('factura', 'numero cliente evento')
        .sort({ orden: 1 });
      
      return items.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los items de factura:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const item = await ItemFactura.findById(id)
        .populate('factura', 'numero cliente evento total');
      return toPlain(item);
    } catch (error) {
      console.error('Error al obtener item de factura por ID:', error);
      return null;
    }
  }

  async getByFactura(facturaId) {
    try {
      const items = await ItemFactura.find({ factura: facturaId })
        .sort({ orden: 1 });
      return items.map(toPlain);
    } catch (error) {
      console.error('Error al obtener items por factura:', error);
      return [];
    }
  }

  async add(item) {
    try {
      const nuevo = await ItemFactura.create({
        factura: item.factura,
        descripcion: item.descripcion,
        categoria: item.categoria,
        cantidad: Number(item.cantidad) || 1,
        precioUnitario: Number(item.precioUnitario) || 0,
        subtotal: (Number(item.cantidad) || 1) * (Number(item.precioUnitario) || 0),
        iva: Number(item.iva) || 0,
        total: ((Number(item.cantidad) || 1) * (Number(item.precioUnitario) || 0)) + (Number(item.iva) || 0),
        orden: Number(item.orden) || 0
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar item de factura:', error);
      return null;
    }
  }

  async addMultiple(items) {
    try {
      const creados = await ItemFactura.insertMany(items);
      return creados.map(toPlain);
    } catch (error) {
      console.error('Error al agregar items múltiples:', error);
      return [];
    }
  }

  async update(id, item) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await ItemFactura.findByIdAndUpdate(id, item, {
        new: true,
        runValidators: true
      })
        .populate('factura', 'numero cliente evento');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar item de factura:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Si se actualiza cantidad o precioUnitario, recalcular subtotal y total
      if (campos.cantidad !== undefined || campos.precioUnitario !== undefined) {
        const item = await ItemFactura.findById(id);
        if (item) {
          const cantidad = campos.cantidad !== undefined ? campos.cantidad : item.cantidad;
          const precioUnitario = campos.precioUnitario !== undefined ? campos.precioUnitario : item.precioUnitario;
          campos.subtotal = cantidad * precioUnitario;
          campos.total = campos.subtotal + (campos.iva !== undefined ? campos.iva : (item.iva || 0));
        }
      }

      const actualizado = await ItemFactura.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('factura', 'numero cliente evento');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente item de factura:', error);
      return null;
    }
  }

  async remover(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await ItemFactura.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar item de factura:', error);
      return null;
    }
  }

  async removerPorFactura(facturaId) {
    try {
      const eliminados = await ItemFactura.deleteMany({ factura: facturaId });
      return eliminados.deletedCount;
    } catch (error) {
      console.error('Error al eliminar items por factura:', error);
      return 0;
    }
  }
}

export default new ItemFacturaModel();

