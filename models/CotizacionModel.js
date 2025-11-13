// models/CotizacionModel.js
// -------------------- MODELO DE COTIZACIÓN --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const CotizacionSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      trim: true
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true
    },
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evento',
      required: true
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemCotizacion'
    }],
    subtotal: {
      type: Number,
      default: 0,
      min: 0
    },
    margenPorcentaje: {
      type: Number,
      default: 20, // 20% por defecto
      min: 0,
      max: 100
    },
    margenMonto: {
      type: Number,
      default: 0,
      min: 0
    },
    iva: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    },
    estado: {
      type: String,
      enum: ['borrador', 'pendiente', 'aprobada', 'rechazada', 'vencida'],
      default: 'borrador'
    },
    version: {
      type: Number,
      default: 1
    },
    versionAnterior: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cotizacion'
    },
    fechaEnvio: {
      type: Date
    },
    fechaVencimiento: {
      type: Date
    },
    fechaAprobacion: {
      type: Date
    },
    observaciones: {
      type: String,
      trim: true
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    aprobadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  },
  { timestamps: true }
);

// -------------------- MIDDLEWARE PRE-SAVE: Calcular totales --------------------
CotizacionSchema.pre('save', async function (next) {
  // Calcular margen en monto
  this.margenMonto = (this.subtotal * this.margenPorcentaje) / 100;
  
  // Calcular IVA (21% sobre subtotal + margen)
  const baseImponible = this.subtotal + this.margenMonto;
  this.iva = baseImponible * 0.21;
  
  // Calcular total
  this.total = baseImponible + this.iva;
  
  next();
});

// -------------------- ÍNDICES --------------------
CotizacionSchema.index({ numero: 1 }, { unique: true });
CotizacionSchema.index({ cliente: 1 });
CotizacionSchema.index({ evento: 1 });
CotizacionSchema.index({ estado: 1 });
CotizacionSchema.index({ fechaEnvio: -1 });

// -------------------- MODELO --------------------
const Cotizacion = mongoose.models.Cotizacion || mongoose.model('Cotizacion', CotizacionSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class CotizacionModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.cliente) query.cliente = filtros.cliente;
      if (filtros.evento) query.evento = filtros.evento;
      if (filtros.estado) query.estado = filtros.estado;

      const cotizaciones = await Cotizacion.find(query)
        .populate('cliente', 'nombre email empresa')
        .populate('evento', 'nombre fechaInicio fechaFin')
        .populate('items')
        .populate('creadoPor', 'email')
        .populate('aprobadoPor', 'email')
        .sort({ createdAt: -1 });
      
      return cotizaciones.map(toPlain);
    } catch (error) {
      console.error('Error al obtener las cotizaciones:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const cotizacion = await Cotizacion.findById(id)
        .populate('cliente', 'nombre email empresa telefono')
        .populate('evento', 'nombre descripcion fechaInicio fechaFin lugar')
        .populate('items')
        .populate('creadoPor', 'email')
        .populate('aprobadoPor', 'email')
        .populate('versionAnterior');
      return toPlain(cotizacion);
    } catch (error) {
      console.error('Error al obtener cotizacion por ID:', error);
      return null;
    }
  }

  async getByNumero(numero) {
    try {
      const cotizacion = await Cotizacion.findOne({ numero })
        .populate('cliente', 'nombre email empresa')
        .populate('evento', 'nombre fechaInicio fechaFin')
        .populate('items');
      return toPlain(cotizacion);
    } catch (error) {
      console.error('Error al obtener cotizacion por número:', error);
      return null;
    }
  }

  async getHistorial(cotizacionId) {
    try {
      const historial = [];
      let actual = await Cotizacion.findById(cotizacionId)
        .populate('versionAnterior');
      
      while (actual) {
        historial.unshift(toPlain(actual));
        if (actual.versionAnterior) {
          actual = await Cotizacion.findById(actual.versionAnterior)
            .populate('versionAnterior');
        } else {
          actual = null;
        }
      }
      
      return historial;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  async generarNumero() {
    try {
      const año = new Date().getFullYear();
      const ultima = await Cotizacion.findOne({
        numero: new RegExp(`^COT-${año}-`)
      }).sort({ numero: -1 });
      
      let siguiente = 1;
      if (ultima) {
        const partes = ultima.numero.split('-');
        siguiente = parseInt(partes[2]) + 1;
      }
      
      return `COT-${año}-${String(siguiente).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error al generar número de cotización:', error);
      return `COT-${new Date().getFullYear()}-${Date.now()}`;
    }
  }

  async add(cotizacion) {
    try {
      // Generar número si no se proporciona
      const numero = cotizacion.numero || await this.generarNumero();
      
      const nueva = await Cotizacion.create({
        numero,
        cliente: cotizacion.cliente,
        evento: cotizacion.evento,
        items: cotizacion.items || [],
        subtotal: cotizacion.subtotal || 0,
        margenPorcentaje: cotizacion.margenPorcentaje || 20,
        estado: cotizacion.estado || 'borrador',
        version: cotizacion.version || 1,
        versionAnterior: cotizacion.versionAnterior || null,
        fechaEnvio: cotizacion.fechaEnvio || null,
        fechaVencimiento: cotizacion.fechaVencimiento || null,
        observaciones: cotizacion.observaciones || '',
        creadoPor: cotizacion.creadoPor,
        aprobadoPor: cotizacion.aprobadoPor || null
      });
      
      // Recalcular totales después de crear
      await nueva.save();
      
      return toPlain(nueva);
    } catch (error) {
      console.error('Error al agregar cotizacion:', error);
      return null;
    }
  }

  async update(id, cotizacion) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Cotizacion.findByIdAndUpdate(id, cotizacion, {
        new: true,
        runValidators: true
      })
        .populate('cliente', 'nombre email empresa')
        .populate('evento', 'nombre fechaInicio fechaFin')
        .populate('items');
      
      if (actualizado) {
        // Recalcular totales
        await actualizado.save();
      }
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar cotizacion:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Cotizacion.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('cliente', 'nombre email empresa')
        .populate('evento', 'nombre fechaInicio fechaFin')
        .populate('items');
      
      if (actualizado) {
        await actualizado.save();
      }
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente cotizacion:', error);
      return null;
    }
  }

  async crearVersion(id, nuevaVersion) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const original = await Cotizacion.findById(id);
      if (!original) return null;

      const numeroNuevo = await this.generarNumero();
      const version = original.version + 1;

      const nueva = await Cotizacion.create({
        numero: numeroNuevo,
        cliente: nuevaVersion.cliente || original.cliente,
        evento: nuevaVersion.evento || original.evento,
        items: nuevaVersion.items || original.items,
        subtotal: nuevaVersion.subtotal || original.subtotal,
        margenPorcentaje: nuevaVersion.margenPorcentaje || original.margenPorcentaje,
        estado: 'borrador',
        version,
        versionAnterior: original._id,
        observaciones: nuevaVersion.observaciones || original.observaciones,
        creadoPor: nuevaVersion.creadoPor || original.creadoPor
      });

      await nueva.save();
      return toPlain(nueva);
    } catch (error) {
      console.error('Error al crear versión:', error);
      return null;
    }
  }

  async aprobar(id, usuarioId) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizada = await Cotizacion.findByIdAndUpdate(
        id,
        {
          estado: 'aprobada',
          fechaAprobacion: new Date(),
          aprobadoPor: usuarioId
        },
        { new: true, runValidators: true }
      )
        .populate('cliente', 'nombre email empresa')
        .populate('evento', 'nombre fechaInicio fechaFin')
        .populate('items');
      
      return actualizada ? toPlain(actualizada) : null;
    } catch (error) {
      console.error('Error al aprobar cotizacion:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminada = await Cotizacion.findByIdAndDelete(id);
      return eliminada ? toPlain(eliminada) : null;
    } catch (error) {
      console.error('Error al eliminar cotizacion:', error);
      return null;
    }
  }

  async recalcularTotales(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const cotizacion = await Cotizacion.findById(id).populate('items');
      if (!cotizacion) return null;

      // Recalcular subtotal desde items
      const ItemCotizacion = mongoose.models.ItemCotizacion;
      if (!ItemCotizacion) {
        // Si el modelo no está cargado, importarlo dinámicamente
        const { default: ItemCotizacionModel } = await import('./ItemCotizacionModel.js');
        const items = await ItemCotizacionModel.getAll({ cotizacion: id });
        const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        cotizacion.subtotal = subtotal;
        await cotizacion.save();
        return toPlain(cotizacion);
      }
      
      const items = await ItemCotizacion.find({ _id: { $in: cotizacion.items } });
      const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      
      cotizacion.subtotal = subtotal;
      await cotizacion.save();
      
      return toPlain(cotizacion);
    } catch (error) {
      console.error('Error al recalcular totales:', error);
      return null;
    }
  }
}

export default new CotizacionModel();

