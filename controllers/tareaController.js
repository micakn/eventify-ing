// controllers/tareaController.js
// -------------------- CONTROLADOR DE TAREAS --------------------
import TareaModel from '../models/TareaModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import EventoModel from '../models/EventoModel.js';
import { TIPOS_TAREAS_POR_AREA } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR Y FILTRAR TAREAS --------------------
const listTareas = asyncHandler(async (req, res) => {
  const { estado, prioridad, fechaInicio, fechaFin, empleadoAsignado, eventoAsignado } = req.query;
  let tareas = await TareaModel.getAll();

  if (estado) tareas = tareas.filter(t => t.estado === estado);
  if (prioridad) tareas = tareas.filter(t => t.prioridad === prioridad);
  if (empleadoAsignado) tareas = tareas.filter(t => String(t.empleadoAsignado?._id || t.empleadoAsignado) === String(empleadoAsignado));
  if (eventoAsignado) tareas = tareas.filter(t => String(t.eventoAsignado?._id || t.eventoAsignado) === String(eventoAsignado));

  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return res.status(400).json({
        mensaje: 'Fechas inválidas',
        detalle: 'Las fechas proporcionadas no tienen un formato válido'
      });
    }
    tareas = tareas.filter(t => {
      if (!t.fechaInicio || !t.fechaFin) return false;
      const tInicio = new Date(t.fechaInicio);
      const tFin = new Date(t.fechaFin);
      return tInicio >= inicio && tFin <= fin;
    });
  }

  res.json({
    total: tareas.length,
    tareas
  });
});

// -------------------- OBTENER UNA TAREA POR ID --------------------
const getTarea = asyncHandler(async (req, res) => {
  const tarea = await TareaModel.getById(req.params.id);
  if (!tarea) {
    return res.status(404).json({
      mensaje: 'Tarea no encontrada',
      detalle: `No existe una tarea con el ID ${req.params.id}`
    });
  }
  res.json(tarea);
});

// -------------------- CREAR NUEVA TAREA --------------------
const addTarea = asyncHandler(async (req, res) => {
  const tarea = req.body;
  
  // Validar tipo de tarea según área
  if (tarea.area && tarea.tipo) {
    const tipos = TIPOS_TAREAS_POR_AREA[tarea.area];
    if (!tipos || !tipos.includes(tarea.tipo)) {
      return res.status(400).json({
        mensaje: 'Tipo de tarea inválido',
        detalle: `El tipo "${tarea.tipo}" no es válido para el área "${tarea.area}"`,
        tiposValidos: tipos || []
      });
    }
  }

  // Validar que empleadoAsignado exista si se proporciona
  if (tarea.empleadoAsignado) {
    const empleado = await EmpleadoModel.getById(tarea.empleadoAsignado);
    if (!empleado) {
      return res.status(404).json({
        mensaje: 'Empleado no encontrado',
        detalle: `No existe un empleado con el ID ${tarea.empleadoAsignado}`
      });
    }
  }

  // Validar que eventoAsignado exista si se proporciona
  if (tarea.eventoAsignado) {
    const evento = await EventoModel.getById(tarea.eventoAsignado);
    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado',
        detalle: `No existe un evento con el ID ${tarea.eventoAsignado}`
      });
    }
  }

  const nuevaTarea = await TareaModel.add(tarea);
  if (!nuevaTarea) {
    return res.status(500).json({
      mensaje: 'Error al crear tarea',
      detalle: 'No se pudo crear la tarea en la base de datos'
    });
  }

  res.status(201).json({
    mensaje: 'Tarea creada exitosamente',
    tarea: nuevaTarea
  });
});

// -------------------- ACTUALIZAR COMPLETAMENTE (PUT) --------------------
const updateTarea = asyncHandler(async (req, res) => {
  const tarea = req.body;
  const id = req.params.id;
  
  if (tarea.area && tarea.tipo) {
    const tipos = TIPOS_TAREAS_POR_AREA[tarea.area];
    if (!tipos || !tipos.includes(tarea.tipo)) {
      return res.status(400).json({
        mensaje: 'Tipo de tarea inválido',
        detalle: `El tipo "${tarea.tipo}" no es válido para el área "${tarea.area}"`
      });
    }
  }

  // Validar referencias si se proporcionan
  if (tarea.empleadoAsignado) {
    const empleado = await EmpleadoModel.getById(tarea.empleadoAsignado);
    if (!empleado) {
      return res.status(404).json({
        mensaje: 'Empleado no encontrado',
        detalle: `No existe un empleado con el ID ${tarea.empleadoAsignado}`
      });
    }
  }

  if (tarea.eventoAsignado) {
    const evento = await EventoModel.getById(tarea.eventoAsignado);
    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado',
        detalle: `No existe un evento con el ID ${tarea.eventoAsignado}`
      });
    }
  }

  const actualizada = await TareaModel.update(id, tarea);
  if (!actualizada) {
    return res.status(404).json({
      mensaje: 'Tarea no encontrada',
      detalle: `No existe una tarea con el ID ${id}`
    });
  }
  
  res.json({
    mensaje: 'Tarea actualizada exitosamente',
    tarea: actualizada
  });
});

// -------------------- ACTUALIZAR PARCIALMENTE (PATCH) --------------------
const patchTarea = asyncHandler(async (req, res) => {
  const campos = req.body;
  const id = req.params.id;
  
  if (campos.area && campos.tipo) {
    const tipos = TIPOS_TAREAS_POR_AREA[campos.area];
    if (!tipos || !tipos.includes(campos.tipo)) {
      return res.status(400).json({
        mensaje: 'Tipo de tarea inválido',
        detalle: `El tipo "${campos.tipo}" no es válido para el área "${campos.area}"`
      });
    }
  }

  // Validar referencias si se proporcionan
  if (campos.empleadoAsignado) {
    const empleado = await EmpleadoModel.getById(campos.empleadoAsignado);
    if (!empleado) {
      return res.status(404).json({
        mensaje: 'Empleado no encontrado',
        detalle: `No existe un empleado con el ID ${campos.empleadoAsignado}`
      });
    }
  }

  if (campos.eventoAsignado) {
    const evento = await EventoModel.getById(campos.eventoAsignado);
    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado',
        detalle: `No existe un evento con el ID ${campos.eventoAsignado}`
      });
    }
  }

  const actualizada = await TareaModel.patch(id, campos);
  if (!actualizada) {
    return res.status(404).json({
      mensaje: 'Tarea no encontrada',
      detalle: `No existe una tarea con el ID ${id}`
    });
  }
  
  res.json({
    mensaje: 'Tarea actualizada parcialmente',
    tarea: actualizada
  });
});

// -------------------- ELIMINAR TAREA --------------------
const deleteTarea = asyncHandler(async (req, res) => {
  const eliminada = await TareaModel.remove(req.params.id);
  if (!eliminada) {
    return res.status(404).json({
      mensaje: 'Tarea no encontrada',
      detalle: `No existe una tarea con el ID ${req.params.id}`
    });
  }
  
  res.json({
    mensaje: 'Tarea eliminada exitosamente',
    tarea: eliminada
  });
});

export default {
  listTareas,
  getTarea,
  addTarea,
  updateTarea,
  patchTarea,
  deleteTarea
};
