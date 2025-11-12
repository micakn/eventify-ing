// models/FacturaClienteModel.js
// -------------------- MODELO DE FACTURA CLIENTE --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const FacturaClienteSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      unique: true,
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
    cotizacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cotizacion'
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemFactura'
    }],
    subtotal: {
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
    fechaEmision: {
      type: Date,
      required: true,
      default: Date.now
    },
    fechaVencimiento: {
      type: Date
    },
    estado: {
      type: String,
      enum: ['borrador', 'pendiente', 'enviada', 'pagada', 'vencida', 'cancelada'],
      default: 'borrador'
    },
    metodoPago: {
      type: String,
      enum: ['transferencia', 'cheque', 'efectivo', 'tarjeta', 'otro'],
      default: 'transferencia'
    },
    condicionImpositiva: {
      type: String,
      enum: ['Responsable Inscripto', 'Monotributo', 'Exento', 'No Responsable'],
      default: 'Responsable Inscripto'
    },
    numeroComprobante: {
      type: String,
      trim: true
    },
    notas: {
      type: String,
      trim: true
    },
    fechaPago: {
      type: Date
    },
    aprobadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado'
    },
    fechaAprobacion: {
      type: Date
    }
  },
  { timestamps: true }
);

// -------------------- ÍNDICES --------------------
FacturaClienteSchema.index({ cliente: 1, fechaEmision: -1 });
FacturaClienteSchema.index({ evento: 1 });
FacturaClienteSchema.index({ estado: 1 });
FacturaClienteSchema.index({ fechaEmision: 1 });
FacturaClienteSchema.index({ numero: 1 });

// -------------------- MIDDLEWARE PRE-SAVE: Calcular total --------------------
FacturaClienteSchema.pre('save', async function (next) {
  // Solo recalcular si es una actualización y hay items
  if (!this.isNew && this.isModified('items') && this.items && this.items.length > 0) {
    try {
      const ItemFacturaModel = (await import('./ItemFacturaModel.js')).default;
      const items = await ItemFacturaModel.getByFactura(this._id);
      
      if (items && items.length > 0) {
        this.subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        this.iva = items.reduce((sum, item) => sum + (item.iva || 0), 0);
        
        // Calcular margen
        if (this.margenPorcentaje > 0) {
          this.margenMonto = (this.subtotal * this.margenPorcentaje) / 100;
        }
        
        this.total = this.subtotal + this.iva + this.margenMonto;
      }
    } catch (error) {
      console.error('Error al recalcular total en pre-save:', error);
    }
  }
  next();
});

// -------------------- MODELO --------------------
const FacturaCliente = mongoose.models.FacturaCliente || mongoose.model('FacturaCliente', FacturaClienteSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class FacturaClienteModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.cliente) query.cliente = filtros.cliente;
      if (filtros.evento) query.evento = filtros.evento;
      if (filtros.estado) query.estado = filtros.estado;
      if (filtros.fechaDesde) query.fechaEmision = { ...query.fechaEmision, $gte: new Date(filtros.fechaDesde) };
      if (filtros.fechaHasta) query.fechaEmision = { ...query.fechaEmision, $lte: new Date(filtros.fechaHasta) };

      const facturas = await FacturaCliente.find(query)
        .populate('cliente', 'nombre email telefono condicionImpositiva')
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('cotizacion', 'numero total')
        .populate('items', 'descripcion cantidad precioUnitario subtotal iva total')
        .populate('aprobadoPor', 'nombre email')
        .sort({ fechaEmision: -1 });
      
      return facturas.map(toPlain);
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const factura = await FacturaCliente.findById(id)
        .populate('cliente', 'nombre email telefono direccion condicionImpositiva')
        .populate('evento', 'nombre fechaInicio fechaFin lugar presupuesto estado')
        .populate('cotizacion', 'numero total items')
        .populate('items', 'descripcion categoria cantidad precioUnitario subtotal iva total orden')
        .populate('aprobadoPor', 'nombre email rol');
      return toPlain(factura);
    } catch (error) {
      console.error('Error al obtener factura por ID:', error);
      return null;
    }
  }

  async getByEvento(eventoId) {
    try {
      const facturas = await FacturaCliente.find({ evento: eventoId })
        .populate('cliente', 'nombre email telefono')
        .populate('items', 'descripcion cantidad precioUnitario subtotal iva total')
        .sort({ fechaEmision: -1 });
      return facturas.map(toPlain);
    } catch (error) {
      console.error('Error al obtener facturas por evento:', error);
      return [];
    }
  }

  async getByCliente(clienteId) {
    try {
      const facturas = await FacturaCliente.find({ cliente: clienteId })
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('items', 'descripcion cantidad precioUnitario subtotal iva total')
        .sort({ fechaEmision: -1 });
      return facturas.map(toPlain);
    } catch (error) {
      console.error('Error al obtener facturas por cliente:', error);
      return [];
    }
  }

  async add(factura) {
    try {
      // Generar número único si no se proporciona
      if (!factura.numero) {
        const count = await FacturaCliente.countDocuments();
        const año = new Date().getFullYear();
        factura.numero = `FC-${año}-${String(count + 1).padStart(6, '0')}`;
      }

      const nueva = await FacturaCliente.create({
        numero: factura.numero,
        cliente: factura.cliente,
        evento: factura.evento,
        cotizacion: factura.cotizacion || null,
        items: factura.items || [],
        subtotal: Number(factura.subtotal) || 0,
        iva: Number(factura.iva) || 0,
        total: Number(factura.total) || 0,
        margenPorcentaje: Number(factura.margenPorcentaje) || 20,
        margenMonto: Number(factura.margenMonto) || 0,
        fechaEmision: factura.fechaEmision || new Date(),
        fechaVencimiento: factura.fechaVencimiento || null,
        estado: factura.estado || 'borrador',
        metodoPago: factura.metodoPago || 'transferencia',
        condicionImpositiva: factura.condicionImpositiva || 'Responsable Inscripto',
        numeroComprobante: factura.numeroComprobante || '',
        notas: factura.notas || '',
        fechaPago: factura.fechaPago || null,
        aprobadoPor: factura.aprobadoPor || null,
        fechaAprobacion: factura.fechaAprobacion || null
      });
      return toPlain(nueva);
    } catch (error) {
      console.error('Error al agregar factura:', error);
      return null;
    }
  }

  async update(id, factura) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Verificar que la factura existe y no está cerrada
      const facturaExistente = await FacturaCliente.findById(id);
      if (!facturaExistente) return null;
      
      // No permitir modificar facturas pagadas o canceladas
      if (facturaExistente.estado === 'pagada' || facturaExistente.estado === 'cancelada') {
        throw new Error('No se puede modificar una factura que está pagada o cancelada');
      }

      const actualizada = await FacturaCliente.findByIdAndUpdate(id, factura, {
        new: true,
        runValidators: true
      })
        .populate('cliente', 'nombre email telefono')
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('items', 'descripcion cantidad precioUnitario subtotal iva total');
      
      // Recalcular total si se actualizaron items
      if (factura.items) {
        await this.recalcularTotal(id);
      }
      
      const facturaActualizada = await this.getById(id);
      return facturaActualizada;
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      throw error;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Verificar que la factura existe y no está cerrada
      const facturaExistente = await FacturaCliente.findById(id);
      if (!facturaExistente) return null;
      
      // No permitir modificar facturas pagadas o canceladas (excepto para marcar como pagada)
      if ((facturaExistente.estado === 'pagada' || facturaExistente.estado === 'cancelada') && 
          campos.estado !== 'pagada' && campos.estado !== 'cancelada') {
        throw new Error('No se puede modificar una factura que está pagada o cancelada');
      }

      const actualizada = await FacturaCliente.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('cliente', 'nombre email telefono')
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('items', 'descripcion cantidad precioUnitario subtotal iva total');
      
      // Si se actualizó el estado a pagada, actualizar fechaPago
      if (campos.estado === 'pagada' && !campos.fechaPago) {
        await FacturaCliente.findByIdAndUpdate(id, { fechaPago: new Date() });
      }
      
      // Recalcular total si se actualizaron items o margen
      if (campos.items || campos.margenPorcentaje) {
        await this.recalcularTotal(id);
      }
      
      const facturaActualizada = await this.getById(id);
      return facturaActualizada;
    } catch (error) {
      console.error('Error al actualizar parcialmente factura:', error);
      throw error;
    }
  }

  async recalcularTotal(id) {
    try {
      const ItemFacturaModel = (await import('./ItemFacturaModel.js')).default;
      const items = await ItemFacturaModel.getByFactura(id);
      
      const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const iva = items.reduce((sum, item) => sum + (item.iva || 0), 0);
      
      const factura = await FacturaCliente.findById(id);
      if (!factura) return null;
      
      const margenMonto = factura.margenPorcentaje > 0 
        ? (subtotal * factura.margenPorcentaje) / 100 
        : (factura.margenMonto || 0);
      
      const total = subtotal + iva + margenMonto;
      
      await FacturaCliente.findByIdAndUpdate(id, {
        subtotal,
        iva,
        margenMonto,
        total
      });
      
      return true;
    } catch (error) {
      console.error('Error al recalcular total:', error);
      return false;
    }
  }

  async aprobar(id, empleadoId) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizada = await FacturaCliente.findByIdAndUpdate(
        id,
        {
          estado: 'enviada',
          aprobadoPor: empleadoId,
          fechaAprobacion: new Date()
        },
        { new: true, runValidators: true }
      )
        .populate('cliente', 'nombre email telefono')
        .populate('evento', 'nombre fechaInicio fechaFin lugar')
        .populate('aprobadoPor', 'nombre email');
      
      return actualizada ? toPlain(actualizada) : null;
    } catch (error) {
      console.error('Error al aprobar factura:', error);
      return null;
    }
  }

  async marcarComoPagada(id, fechaPago) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizada = await FacturaCliente.findByIdAndUpdate(
        id,
        {
          estado: 'pagada',
          fechaPago: fechaPago || new Date()
        },
        { new: true, runValidators: true }
      )
        .populate('cliente', 'nombre email telefono')
        .populate('evento', 'nombre fechaInicio fechaFin lugar');
      
      return actualizada ? toPlain(actualizada) : null;
    } catch (error) {
      console.error('Error al marcar factura como pagada:', error);
      return null;
    }
  }

  async remover(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Eliminar items asociados
      const ItemFacturaModel = (await import('./ItemFacturaModel.js')).default;
      await ItemFacturaModel.removerPorFactura(id);
      
      const eliminada = await FacturaCliente.findByIdAndDelete(id);
      return eliminada ? toPlain(eliminada) : null;
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      return null;
    }
  }

  async removerPorEvento(eventoId) {
    try {
      const facturas = await FacturaCliente.find({ evento: eventoId });
      const ItemFacturaModel = (await import('./ItemFacturaModel.js')).default;
      
      // Eliminar items de cada factura
      for (const factura of facturas) {
        await ItemFacturaModel.removerPorFactura(factura._id);
      }
      
      const eliminadas = await FacturaCliente.deleteMany({ evento: eventoId });
      return eliminadas.deletedCount;
    } catch (error) {
      console.error('Error al eliminar facturas por evento:', error);
      return 0;
    }
  }

  async actualizarEstadosVencidos() {
    try {
      const ahora = new Date();
      const actualizados = await FacturaCliente.updateMany(
        {
          estado: { $in: ['enviada', 'pendiente'] },
          fechaVencimiento: { $lt: ahora }
        },
        {
          $set: { estado: 'vencida' }
        }
      );
      return actualizados.modifiedCount;
    } catch (error) {
      console.error('Error al actualizar estados vencidos:', error);
      return 0;
    }
  }
}

export default new FacturaClienteModel();

