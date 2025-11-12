// models/GastoModel.js
// -------------------- MODELO DE GASTO (GASTOS REALES POR EVENTO) --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const GastoSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evento',
      required: true
    },
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proveedor'
    },
    cotizacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cotizacion'
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: String,
      enum: ['Catering', 'Sonido', 'Iluminación', 'Decoración', 'Logística', 'Otros'],
      required: true
    },
    monto: {
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
    fecha: {
      type: Date,
      required: true,
      default: Date.now
    },
    fechaVencimiento: {
      type: Date
    },
    estado: {
      type: String,
      enum: ['pendiente', 'pagado', 'cancelado', 'vencido'],
      default: 'pendiente'
    },
    metodoPago: {
      type: String,
      enum: ['transferencia', 'cheque', 'efectivo', 'tarjeta', 'otro'],
      default: 'transferencia'
    },
    numeroFactura: {
      type: String,
      trim: true
    },
    notas: {
      type: String,
      trim: true
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
GastoSchema.index({ evento: 1, fecha: -1 });
GastoSchema.index({ proveedor: 1 });
GastoSchema.index({ categoria: 1 });
GastoSchema.index({ estado: 1 });
GastoSchema.index({ fecha: 1 });

// -------------------- MIDDLEWARE PRE-SAVE: Calcular total --------------------
GastoSchema.pre('save', function (next) {
  if (this.isModified('monto') || this.isModified('iva')) {
    this.total = this.monto + this.iva;
  }
  next();
});

// -------------------- MODELO --------------------
const Gasto = mongoose.models.Gasto || mongoose.model('Gasto', GastoSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class GastoModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.evento) query.evento = filtros.evento;
      if (filtros.proveedor) query.proveedor = filtros.proveedor;
      if (filtros.categoria) query.categoria = filtros.categoria;
      if (filtros.estado) query.estado = filtros.estado;
      if (filtros.fechaDesde) query.fecha = { ...query.fecha, $gte: new Date(filtros.fechaDesde) };
      if (filtros.fechaHasta) query.fecha = { ...query.fecha, $lte: new Date(filtros.fechaHasta) };

      const gastos = await Gasto.find(query)
        .populate('evento', 'nombre fechaInicio fechaFin lugar presupuesto')
        .populate('proveedor', 'nombre contacto email')
        .populate('cotizacion', 'numero total')
        .populate('aprobadoPor', 'nombre email')
        .sort({ fecha: -1 });
      
      return gastos.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const gasto = await Gasto.findById(id)
        .populate('evento', 'nombre fechaInicio fechaFin lugar presupuesto estado')
        .populate('proveedor', 'nombre contacto email telefono')
        .populate('cotizacion', 'numero total items')
        .populate('aprobadoPor', 'nombre email rol');
      return toPlain(gasto);
    } catch (error) {
      console.error('Error al obtener gasto por ID:', error);
      return null;
    }
  }

  async getByEvento(eventoId) {
    try {
      const gastos = await Gasto.find({ evento: eventoId })
        .populate('proveedor', 'nombre contacto email')
        .populate('cotizacion', 'numero total')
        .sort({ fecha: -1 });
      return gastos.map(toPlain);
    } catch (error) {
      console.error('Error al obtener gastos por evento:', error);
      return [];
    }
  }

  async getResumenPorEvento(eventoId) {
    try {
      const gastos = await Gasto.find({ evento: eventoId, estado: { $ne: 'cancelado' } });
      
      const resumen = {
        totalGastos: gastos.reduce((sum, g) => sum + (g.total || 0), 0),
        totalPagado: gastos.filter(g => g.estado === 'pagado').reduce((sum, g) => sum + (g.total || 0), 0),
        totalPendiente: gastos.filter(g => g.estado === 'pendiente').reduce((sum, g) => sum + (g.total || 0), 0),
        totalVencido: gastos.filter(g => g.estado === 'vencido').reduce((sum, g) => sum + (g.total || 0), 0),
        porCategoria: {},
        cantidad: gastos.length
      };

      // Agrupar por categoría
      gastos.forEach(gasto => {
        const categoria = gasto.categoria || 'Otros';
        if (!resumen.porCategoria[categoria]) {
          resumen.porCategoria[categoria] = {
            total: 0,
            cantidad: 0
          };
        }
        resumen.porCategoria[categoria].total += gasto.total || 0;
        resumen.porCategoria[categoria].cantidad += 1;
      });

      return resumen;
    } catch (error) {
      console.error('Error al obtener resumen por evento:', error);
      return null;
    }
  }

  async add(gasto) {
    try {
      // Generar número único si no se proporciona
      if (!gasto.numero) {
        const count = await Gasto.countDocuments();
        gasto.numero = `GAS-${Date.now()}-${count + 1}`;
      }

      const nuevo = await Gasto.create({
        numero: gasto.numero,
        evento: gasto.evento,
        proveedor: gasto.proveedor || null,
        cotizacion: gasto.cotizacion || null,
        descripcion: gasto.descripcion,
        categoria: gasto.categoria,
        monto: Number(gasto.monto) || 0,
        iva: Number(gasto.iva) || 0,
        total: Number(gasto.monto) + Number(gasto.iva) || 0,
        fecha: gasto.fecha || new Date(),
        fechaVencimiento: gasto.fechaVencimiento || null,
        estado: gasto.estado || 'pendiente',
        metodoPago: gasto.metodoPago || 'transferencia',
        numeroFactura: gasto.numeroFactura || '',
        notas: gasto.notas || '',
        aprobadoPor: gasto.aprobadoPor || null,
        fechaAprobacion: gasto.fechaAprobacion || null
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar gasto:', error);
      return null;
    }
  }

  async update(id, gasto) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Verificar que el gasto existe
      const gastoExistente = await Gasto.findById(id);
      if (!gastoExistente) return null;
      
      // No permitir modificar gastos pagados o cancelados
      if (gastoExistente.estado === 'pagado' || gastoExistente.estado === 'cancelado') {
        throw new Error('No se puede modificar un gasto que está pagado o cancelado');
      }

      const actualizado = await Gasto.findByIdAndUpdate(id, gasto, {
        new: true,
        runValidators: true
      })
        .populate('evento', 'nombre fechaInicio fechaFin lugar presupuesto')
        .populate('proveedor', 'nombre contacto email')
        .populate('cotizacion', 'numero total');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      throw error;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Si se actualiza monto o iva, recalcular total
      if (campos.monto !== undefined || campos.iva !== undefined) {
        const gasto = await Gasto.findById(id);
        if (gasto) {
          campos.total = (campos.monto !== undefined ? campos.monto : gasto.monto) + 
                        (campos.iva !== undefined ? campos.iva : gasto.iva);
        }
      }

      const actualizado = await Gasto.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      )
        .populate('evento', 'nombre fechaInicio fechaFin lugar presupuesto')
        .populate('proveedor', 'nombre contacto email')
        .populate('cotizacion', 'numero total');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente gasto:', error);
      return null;
    }
  }

  async aprobar(id, empleadoId) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Gasto.findByIdAndUpdate(
        id,
        {
          estado: 'pagado',
          aprobadoPor: empleadoId,
          fechaAprobacion: new Date()
        },
        { new: true, runValidators: true }
      )
        .populate('evento', 'nombre fechaInicio fechaFin lugar presupuesto')
        .populate('proveedor', 'nombre contacto email')
        .populate('aprobadoPor', 'nombre email');
      
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al aprobar gasto:', error);
      return null;
    }
  }

  async remover(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Gasto.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      return null;
    }
  }

  async removerPorEvento(eventoId) {
    try {
      const eliminados = await Gasto.deleteMany({ evento: eventoId });
      return eliminados.deletedCount;
    } catch (error) {
      console.error('Error al eliminar gastos por evento:', error);
      return 0;
    }
  }

  async actualizarEstadosVencidos() {
    try {
      const ahora = new Date();
      const actualizados = await Gasto.updateMany(
        {
          estado: 'pendiente',
          fechaVencimiento: { $lt: ahora }
        },
        {
          $set: { estado: 'vencido' }
        }
      );
      return actualizados.modifiedCount;
    } catch (error) {
      console.error('Error al actualizar estados vencidos:', error);
      return 0;
    }
  }
}

export default new GastoModel();

