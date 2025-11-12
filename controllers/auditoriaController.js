// controllers/auditoriaController.js
// -------------------- CONTROLADOR DE AUDITORÍA --------------------
import AuditoriaModel from '../models/AuditoriaModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR REGISTROS DE AUDITORÍA --------------------
const listAuditoria = asyncHandler(async (req, res) => {
  const { usuario, empleado, entidad, entidadId, accion, resultado, fechaDesde, fechaHasta, limit, skip } = req.query;
  
  const filtros = {};
  if (usuario) filtros.usuario = usuario;
  if (empleado) filtros.empleado = empleado;
  if (entidad) filtros.entidad = entidad;
  if (entidadId) filtros.entidadId = entidadId;
  if (accion) filtros.accion = accion;
  if (resultado) filtros.resultado = resultado;
  if (fechaDesde) filtros.fechaDesde = fechaDesde;
  if (fechaHasta) filtros.fechaHasta = fechaHasta;
  if (limit) filtros.limit = parseInt(limit);
  if (skip) filtros.skip = parseInt(skip);

  const resultadoAuditoria = await AuditoriaModel.getAll(filtros);
  
  res.json({
    mensaje: 'Registros de auditoría obtenidos exitosamente',
    ...resultadoAuditoria
  });
});

// -------------------- OBTENER REGISTRO POR ID --------------------
const getAuditoria = asyncHandler(async (req, res) => {
  const registro = await AuditoriaModel.getById(req.params.id);
  if (!registro) {
    return res.status(404).json({
      mensaje: 'Registro de auditoría no encontrado',
      detalle: `No existe un registro con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Registro de auditoría obtenido exitosamente',
    registro
  });
});

// -------------------- OBTENER REGISTROS POR ENTIDAD --------------------
const getAuditoriaPorEntidad = asyncHandler(async (req, res) => {
  const { entidad, entidadId } = req.params;
  
  const registros = await AuditoriaModel.getByEntidad(entidad, entidadId);
  
  res.json({
    mensaje: 'Registros de auditoría obtenidos exitosamente',
    entidad,
    entidadId,
    total: registros.length,
    registros
  });
});

// -------------------- OBTENER REGISTROS POR USUARIO --------------------
const getAuditoriaPorUsuario = asyncHandler(async (req, res) => {
  const { usuarioId } = req.params;
  const { accion, entidad, fechaDesde, fechaHasta, limit } = req.query;
  
  const filtros = {};
  if (accion) filtros.accion = accion;
  if (entidad) filtros.entidad = entidad;
  if (fechaDesde) filtros.fechaDesde = fechaDesde;
  if (fechaHasta) filtros.fechaHasta = fechaHasta;
  if (limit) filtros.limit = parseInt(limit);

  const registros = await AuditoriaModel.getByUsuario(usuarioId, filtros);
  
  res.json({
    mensaje: 'Registros de auditoría obtenidos exitosamente',
    usuario: usuarioId,
    total: registros.length,
    registros
  });
});

// -------------------- OBTENER RESUMEN DE AUDITORÍA --------------------
const getResumen = asyncHandler(async (req, res) => {
  const { fechaDesde, fechaHasta } = req.query;
  
  const filtros = {};
  if (fechaDesde) filtros.fechaDesde = fechaDesde;
  if (fechaHasta) filtros.fechaHasta = fechaHasta;

  const resumen = await AuditoriaModel.getResumen(filtros);
  
  if (!resumen) {
    return res.status(500).json({
      mensaje: 'Error al obtener resumen de auditoría',
      detalle: 'No se pudo generar el resumen'
    });
  }

  res.json({
    mensaje: 'Resumen de auditoría obtenido exitosamente',
    resumen
  });
});

export default {
  listAuditoria,
  getAuditoria,
  getAuditoriaPorEntidad,
  getAuditoriaPorUsuario,
  getResumen
};

