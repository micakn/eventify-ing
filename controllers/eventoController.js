// controllers/eventoController.js
// -------------------- CONTROLADOR DE EVENTOS --------------------
import EventoModel from '../models/EventoModel.js';
import HitoModel from '../models/HitoModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR TODOS LOS EVENTOS --------------------
const listEventos = asyncHandler(async (req, res) => {
  const { estado, cliente, responsable } = req.query;
  const filtros = {};
  if (estado) filtros.estado = estado;
  if (cliente) filtros.cliente = cliente;
  if (responsable) filtros.responsable = responsable;

  const eventos = await EventoModel.getAll(filtros);
  res.json({
    total: eventos.length,
    eventos
  });
});

// -------------------- OBTENER EVENTO POR ID --------------------
const getEvento = asyncHandler(async (req, res) => {
  const evento = await EventoModel.getById(req.params.id);
  if (!evento) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.id}`
    });
  }
  res.json(evento);
});

// -------------------- CREAR NUEVO EVENTO --------------------
const addEvento = asyncHandler(async (req, res) => {
  const nuevoEvento = await EventoModel.add(req.body);
  if (!nuevoEvento) {
    return res.status(500).json({
      mensaje: 'Error al crear evento',
      detalle: 'No se pudo crear el evento en la base de datos'
    });
  }
  res.status(201).json({
    mensaje: 'Evento creado exitosamente',
    evento: nuevoEvento
  });
});

// -------------------- ACTUALIZAR COMPLETAMENTE EVENTO --------------------
const updateEvento = asyncHandler(async (req, res) => {
  const actualizado = await EventoModel.update(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Evento actualizado exitosamente',
    evento: actualizado
  });
});

// -------------------- ACTUALIZAR PARCIALMENTE EVENTO --------------------
const patchEvento = asyncHandler(async (req, res) => {
  const actualizado = await EventoModel.patch(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Evento actualizado parcialmente',
    evento: actualizado
  });
});

// -------------------- ELIMINAR EVENTO --------------------
const deleteEvento = asyncHandler(async (req, res) => {
  const eliminado = await EventoModel.remove(req.params.id);
  if (!eliminado) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.id}`
    });
  }
  
  // Eliminar hitos asociados
  await HitoModel.removerPorEvento(req.params.id);
  
  res.json({
    mensaje: 'Evento eliminado exitosamente',
    evento: eliminado
  });
});

// -------------------- AGREGAR RESPONSABLE --------------------
const agregarResponsable = asyncHandler(async (req, res) => {
  const { empleadoId } = req.body;
  
  if (!empleadoId) {
    return res.status(400).json({
      mensaje: 'Empleado requerido',
      detalle: 'Debe proporcionar el ID del empleado'
    });
  }

  const actualizado = await EventoModel.agregarResponsable(req.params.id, empleadoId);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Responsable agregado exitosamente',
    evento: actualizado
  });
});

// -------------------- REMOVER RESPONSABLE --------------------
const removerResponsable = asyncHandler(async (req, res) => {
  const { empleadoId } = req.body;
  
  if (!empleadoId) {
    return res.status(400).json({
      mensaje: 'Empleado requerido',
      detalle: 'Debe proporcionar el ID del empleado'
    });
  }

  const actualizado = await EventoModel.removerResponsable(req.params.id, empleadoId);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Responsable removido exitosamente',
    evento: actualizado
  });
});

// -------------------- CAMBIAR ESTADO --------------------
const cambiarEstado = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  
  if (!estado) {
    return res.status(400).json({
      mensaje: 'Estado requerido',
      detalle: 'Debe proporcionar el nuevo estado del evento'
    });
  }

  const actualizado = await EventoModel.cambiarEstado(req.params.id, estado);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado o estado inválido',
      detalle: `No existe un evento con el ID ${req.params.id} o el estado proporcionado es inválido`
    });
  }

  res.json({
    mensaje: 'Estado actualizado exitosamente',
    evento: actualizado
  });
});

// -------------------- OBTENER CRONOGRAMA --------------------
const getCronograma = asyncHandler(async (req, res) => {
  const cronograma = await HitoModel.getCronogramaEvento(req.params.id);
  
  if (!cronograma) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.id}`
    });
  }

  res.json({
    evento: req.params.id,
    cronograma
  });
});

export default { 
  listEventos, 
  getEvento, 
  addEvento, 
  updateEvento, 
  patchEvento, 
  deleteEvento,
  agregarResponsable,
  removerResponsable,
  cambiarEstado,
  getCronograma
};



