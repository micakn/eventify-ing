// controllers/hitoController.js
// -------------------- CONTROLADOR DE HITOS --------------------
import HitoModel from '../models/HitoModel.js';
import EventoModel from '../models/EventoModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR HITOS --------------------
const listHitos = asyncHandler(async (req, res) => {
  const { evento, estado, responsable, tipo, completado } = req.query;
  
  const filtros = {};
  if (evento) filtros.evento = evento;
  if (estado) filtros.estado = estado;
  if (responsable) filtros.responsable = responsable;
  if (tipo) filtros.tipo = tipo;
  if (completado !== undefined) filtros.completado = completado === 'true';

  const hitos = await HitoModel.getAll(filtros);
  
  res.json({
    total: hitos.length,
    hitos
  });
});

// -------------------- OBTENER HITO POR ID --------------------
const getHito = asyncHandler(async (req, res) => {
  const hito = await HitoModel.getById(req.params.id);
  if (!hito) {
    return res.status(404).json({
      mensaje: 'Hito no encontrado',
      detalle: `No existe un hito con el ID ${req.params.id}`
    });
  }
  res.json(hito);
});

// -------------------- OBTENER HITOS POR EVENTO --------------------
const getHitosPorEvento = asyncHandler(async (req, res) => {
  const hitos = await HitoModel.getByEvento(req.params.eventoId);
  
  res.json({
    total: hitos.length,
    hitos
  });
});

// -------------------- CREAR HITO --------------------
const addHito = asyncHandler(async (req, res) => {
  const { evento } = req.body;

  // Validar que el evento existe
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  const nuevoHito = await HitoModel.add(req.body);
  if (!nuevoHito) {
    return res.status(500).json({
      mensaje: 'Error al crear hito',
      detalle: 'No se pudo crear el hito en la base de datos'
    });
  }

  res.status(201).json({
    mensaje: 'Hito creado exitosamente',
    hito: nuevoHito
  });
});

// -------------------- ACTUALIZAR HITO --------------------
const updateHito = asyncHandler(async (req, res) => {
  const actualizado = await HitoModel.update(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Hito no encontrado',
      detalle: `No existe un hito con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Hito actualizado exitosamente',
    hito: actualizado
  });
});

// -------------------- ACTUALIZAR PARCIALMENTE HITO --------------------
const patchHito = asyncHandler(async (req, res) => {
  const actualizado = await HitoModel.patch(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Hito no encontrado',
      detalle: `No existe un hito con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Hito actualizado parcialmente',
    hito: actualizado
  });
});

// -------------------- COMPLETAR HITO --------------------
const completarHito = asyncHandler(async (req, res) => {
  const completado = await HitoModel.completar(req.params.id);
  if (!completado) {
    return res.status(404).json({
      mensaje: 'Hito no encontrado',
      detalle: `No existe un hito con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Hito completado exitosamente',
    hito: completado
  });
});

// -------------------- ELIMINAR HITO --------------------
const deleteHito = asyncHandler(async (req, res) => {
  const eliminado = await HitoModel.remover(req.params.id);
  if (!eliminado) {
    return res.status(404).json({
      mensaje: 'Hito no encontrado',
      detalle: `No existe un hito con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Hito eliminado exitosamente',
    hito: eliminado
  });
});

export default {
  listHitos,
  getHito,
  getHitosPorEvento,
  addHito,
  updateHito,
  patchHito,
  completarHito,
  deleteHito
};

