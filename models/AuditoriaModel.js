// models/AuditoriaModel.js
// -------------------- MODELO DE AUDITORÍA (REGISTRO INMUTABLE) --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const AuditoriaSchema = new mongoose.Schema(
  {
    accion: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete', 'approve', 'reject', 'view', 'export', 'login', 'logout'],
      trim: true
    },
    entidad: {
      type: String,
      required: true,
      trim: true
    },
    entidadId: {
      type: String,
      required: true,
      trim: true
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false // Hacer opcional para permitir registro sin usuario en algunos casos
    },
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado'
    },
    cambios: {
      type: mongoose.Schema.Types.Mixed
    },
    datosAntes: {
      type: mongoose.Schema.Types.Mixed
    },
    datosDespues: {
      type: mongoose.Schema.Types.Mixed
    },
    ip: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    },
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    resultado: {
      type: String,
      enum: ['success', 'error', 'warning'],
      default: 'success'
    },
    mensaje: {
      type: String,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { 
    timestamps: true,
    // Deshabilitar versionado para evitar modificaciones
    versionKey: false
  }
);

// -------------------- ÍNDICES --------------------
AuditoriaSchema.index({ fecha: -1 });
AuditoriaSchema.index({ usuario: 1, fecha: -1 });
AuditoriaSchema.index({ entidad: 1, entidadId: 1 });
AuditoriaSchema.index({ accion: 1, fecha: -1 });
AuditoriaSchema.index({ entidad: 1, accion: 1, fecha: -1 });
AuditoriaSchema.index({ empleado: 1, fecha: -1 });

// -------------------- MIDDLEWARE PRE-SAVE: Prevenir modificaciones --------------------
AuditoriaSchema.pre('save', function (next) {
  // Si el documento ya existe, no permitir modificaciones
  if (!this.isNew) {
    return next(new Error('Los registros de auditoría son inmutables y no pueden ser modificados'));
  }
  next();
});

// -------------------- MIDDLEWARE PRE-REMOVE: Prevenir eliminaciones --------------------
AuditoriaSchema.pre('remove', function (next) {
  return next(new Error('Los registros de auditoría son inmutables y no pueden ser eliminados'));
});

AuditoriaSchema.pre('deleteOne', function (next) {
  return next(new Error('Los registros de auditoría son inmutables y no pueden ser eliminados'));
});

AuditoriaSchema.pre('deleteMany', function (next) {
  return next(new Error('Los registros de auditoría son inmutables y no pueden ser eliminados'));
});

// -------------------- MODELO --------------------
const Auditoria = mongoose.models.Auditoria || mongoose.model('Auditoria', AuditoriaSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class AuditoriaModel {
  async getAll(filtros = {}) {
    try {
      const query = {};
      if (filtros.usuario) query.usuario = filtros.usuario;
      if (filtros.empleado) query.empleado = filtros.empleado;
      if (filtros.entidad) query.entidad = filtros.entidad;
      if (filtros.entidadId) query.entidadId = filtros.entidadId;
      if (filtros.accion) query.accion = filtros.accion;
      if (filtros.resultado) query.resultado = filtros.resultado;
      if (filtros.fechaDesde) query.fecha = { ...query.fecha, $gte: new Date(filtros.fechaDesde) };
      if (filtros.fechaHasta) query.fecha = { ...query.fecha, $lte: new Date(filtros.fechaHasta) };

      const limit = filtros.limit || 100;
      const skip = filtros.skip || 0;

      const registros = await Auditoria.find(query)
        .populate('usuario', 'email rol')
        .populate('empleado', 'nombre rol area email')
        .sort({ fecha: -1 })
        .limit(limit)
        .skip(skip);
      
      const total = await Auditoria.countDocuments(query);
      
      return {
        registros: registros.map(toPlain),
        total,
        limit,
        skip
      };
    } catch (error) {
      console.error('Error al obtener los registros de auditoría:', error);
      return { registros: [], total: 0, limit: 100, skip: 0 };
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const registro = await Auditoria.findById(id)
        .populate('usuario', 'email rol')
        .populate('empleado', 'nombre rol area email');
      return toPlain(registro);
    } catch (error) {
      console.error('Error al obtener registro de auditoría por ID:', error);
      return null;
    }
  }

  async getByEntidad(entidad, entidadId) {
    try {
      const registros = await Auditoria.find({ entidad, entidadId })
        .populate('usuario', 'email rol')
        .populate('empleado', 'nombre rol area email')
        .sort({ fecha: -1 });
      return registros.map(toPlain);
    } catch (error) {
      console.error('Error al obtener registros por entidad:', error);
      return [];
    }
  }

  async getByUsuario(usuarioId, filtros = {}) {
    try {
      const query = { usuario: usuarioId };
      if (filtros.accion) query.accion = filtros.accion;
      if (filtros.entidad) query.entidad = filtros.entidad;
      if (filtros.fechaDesde) query.fecha = { ...query.fecha, $gte: new Date(filtros.fechaDesde) };
      if (filtros.fechaHasta) query.fecha = { ...query.fecha, $lte: new Date(filtros.fechaHasta) };

      const registros = await Auditoria.find(query)
        .populate('usuario', 'email rol')
        .populate('empleado', 'nombre rol area email')
        .sort({ fecha: -1 })
        .limit(filtros.limit || 100);
      
      return registros.map(toPlain);
    } catch (error) {
      console.error('Error al obtener registros por usuario:', error);
      return [];
    }
  }

  async getResumen(filtros = {}) {
    try {
      const query = {};
      if (filtros.fechaDesde) query.fecha = { ...query.fecha, $gte: new Date(filtros.fechaDesde) };
      if (filtros.fechaHasta) query.fecha = { ...query.fecha, $lte: new Date(filtros.fechaHasta) };

      const resumen = {
        total: await Auditoria.countDocuments(query),
        porAccion: {},
        porEntidad: {},
        porUsuario: {},
        porResultado: {
          success: await Auditoria.countDocuments({ ...query, resultado: 'success' }),
          error: await Auditoria.countDocuments({ ...query, resultado: 'error' }),
          warning: await Auditoria.countDocuments({ ...query, resultado: 'warning' })
        }
      };

      // Agrupar por acción
      const acciones = await Auditoria.aggregate([
        { $match: query },
        { $group: { _id: '$accion', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      acciones.forEach(item => {
        resumen.porAccion[item._id] = item.count;
      });

      // Agrupar por entidad
      const entidades = await Auditoria.aggregate([
        { $match: query },
        { $group: { _id: '$entidad', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      entidades.forEach(item => {
        resumen.porEntidad[item._id] = item.count;
      });

      // Agrupar por usuario (top 10)
      const usuarios = await Auditoria.aggregate([
        { $match: query },
        { $group: { _id: '$usuario', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      usuarios.forEach(item => {
        resumen.porUsuario[String(item._id)] = item.count;
      });

      return resumen;
    } catch (error) {
      console.error('Error al obtener resumen de auditoría:', error);
      return null;
    }
  }

  async registrar(datos) {
    try {
      const registro = await Auditoria.create({
        accion: datos.accion,
        entidad: datos.entidad,
        entidadId: datos.entidadId || '',
        usuario: datos.usuario,
        empleado: datos.empleado || null,
        cambios: datos.cambios || null,
        datosAntes: datos.datosAntes || null,
        datosDespues: datos.datosDespues || null,
        ip: datos.ip || '',
        userAgent: datos.userAgent || '',
        fecha: datos.fecha || new Date(),
        resultado: datos.resultado || 'success',
        mensaje: datos.mensaje || '',
        metadata: datos.metadata || null
      });
      return toPlain(registro);
    } catch (error) {
      console.error('Error al registrar auditoría:', error);
      // No lanzar error para no interrumpir el flujo principal
      return null;
    }
  }

  // Método especial para operaciones financieras críticas
  async registrarOperacionFinanciera(datos) {
    try {
      // Si no hay usuario, permitir registro sin usuario para tracking
      const usuarioId = datos.usuario || null;
      
      const registro = await Auditoria.create({
        accion: datos.accion,
        entidad: datos.entidad, // 'FacturaCliente', 'Gasto', 'Cotizacion'
        entidadId: datos.entidadId,
        usuario: usuarioId,
        empleado: datos.empleado || null,
        cambios: datos.cambios || {
          campo: datos.campo || '',
          valorAnterior: datos.valorAnterior || null,
          valorNuevo: datos.valorNuevo || null,
          metodo: datos.metadata?.metodo || '',
          url: datos.metadata?.url || ''
        },
        datosAntes: datos.datosAntes || null,
        datosDespues: datos.datosDespues || null,
        ip: datos.ip || '',
        userAgent: datos.userAgent || '',
        fecha: datos.fecha || new Date(),
        resultado: datos.resultado || 'success',
        mensaje: datos.mensaje || '',
        metadata: {
          ...datos.metadata,
          tipo: 'operacion_financiera',
          criticidad: 'alta',
          operacion_financiera_sin_usuario: !usuarioId
        }
      });
      return toPlain(registro);
    } catch (error) {
      console.error('Error al registrar operación financiera:', error);
      // No lanzar error para no interrumpir el flujo principal
      return null;
    }
  }
}

export default new AuditoriaModel();

