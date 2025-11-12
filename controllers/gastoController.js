// controllers/gastoController.js
// -------------------- CONTROLADOR DE GASTOS --------------------
import GastoModel from '../models/GastoModel.js';
import EventoModel from '../models/EventoModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR GASTOS --------------------
const listGastos = asyncHandler(async (req, res) => {
  const { evento, proveedor, categoria, estado, fechaDesde, fechaHasta } = req.query;
  
  const filtros = {};
  if (evento) filtros.evento = evento;
  if (proveedor) filtros.proveedor = proveedor;
  if (categoria) filtros.categoria = categoria;
  if (estado) filtros.estado = estado;
  if (fechaDesde) filtros.fechaDesde = fechaDesde;
  if (fechaHasta) filtros.fechaHasta = fechaHasta;

  const gastos = await GastoModel.getAll(filtros);
  
  res.json({
    total: gastos.length,
    gastos
  });
});

// -------------------- OBTENER GASTO POR ID --------------------
const getGasto = asyncHandler(async (req, res) => {
  const gasto = await GastoModel.getById(req.params.id);
  if (!gasto) {
    return res.status(404).json({
      mensaje: 'Gasto no encontrado',
      detalle: `No existe un gasto con el ID ${req.params.id}`
    });
  }
  res.json(gasto);
});

// -------------------- OBTENER GASTOS POR EVENTO --------------------
const getGastosPorEvento = asyncHandler(async (req, res) => {
  const gastos = await GastoModel.getByEvento(req.params.eventoId);
  
  res.json({
    total: gastos.length,
    gastos
  });
});

// -------------------- OBTENER RESUMEN DE GASTOS POR EVENTO --------------------
const getResumenPorEvento = asyncHandler(async (req, res) => {
  const resumen = await GastoModel.getResumenPorEvento(req.params.eventoId);
  
  if (!resumen) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${req.params.eventoId}`
    });
  }

  // Obtener presupuesto del evento para calcular desvío
  const evento = await EventoModel.getById(req.params.eventoId);
  if (evento) {
    resumen.presupuesto = evento.presupuesto || 0;
    resumen.desvio = resumen.totalGastos - resumen.presupuesto;
    resumen.desvioPorcentaje = resumen.presupuesto > 0 
      ? ((resumen.desvio / resumen.presupuesto) * 100).toFixed(2)
      : 0;
    resumen.alertaDesvio = Math.abs(resumen.desvioPorcentaje) > 10; // Alerta si desvío > 10%
  }

  res.json({
    evento: req.params.eventoId,
    resumen
  });
});

// -------------------- CREAR GASTO --------------------
const addGasto = asyncHandler(async (req, res) => {
  const { evento } = req.body;

  // Validar que el evento existe
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  const nuevoGasto = await GastoModel.add(req.body);
  if (!nuevoGasto) {
    return res.status(500).json({
      mensaje: 'Error al crear gasto',
      detalle: 'No se pudo crear el gasto en la base de datos'
    });
  }

  res.status(201).json({
    mensaje: 'Gasto creado exitosamente',
    gasto: nuevoGasto
  });
});

// -------------------- ACTUALIZAR GASTO --------------------
const updateGasto = asyncHandler(async (req, res) => {
  try {
    const actualizado = await GastoModel.update(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).json({
        mensaje: 'Gasto no encontrado',
        detalle: `No existe un gasto con el ID ${req.params.id}`
      });
    }
    res.json({
      mensaje: 'Gasto actualizado exitosamente',
      gasto: actualizado
    });
  } catch (error) {
    if (error.message.includes('No se puede modificar')) {
      return res.status(403).json({
        mensaje: 'Operación no permitida',
        detalle: error.message
      });
    }
    throw error;
  }
});

// -------------------- APROBAR GASTO --------------------
const aprobarGasto = asyncHandler(async (req, res) => {
  const { empleadoId } = req.body;
  
  if (!empleadoId) {
    return res.status(400).json({
      mensaje: 'Empleado requerido',
      detalle: 'Debe proporcionar el ID del empleado que aprueba el gasto'
    });
  }

  const aprobado = await GastoModel.aprobar(req.params.id, empleadoId);
  if (!aprobado) {
    return res.status(404).json({
      mensaje: 'Gasto no encontrado',
      detalle: `No existe un gasto con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Gasto aprobado exitosamente',
    gasto: aprobado
  });
});

// -------------------- ELIMINAR GASTO --------------------
const deleteGasto = asyncHandler(async (req, res) => {
  const eliminado = await GastoModel.remover(req.params.id);
  if (!eliminado) {
    return res.status(404).json({
      mensaje: 'Gasto no encontrado',
      detalle: `No existe un gasto con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Gasto eliminado exitosamente',
    gasto: eliminado
  });
});

export default {
  listGastos,
  getGasto,
  getGastosPorEvento,
  getResumenPorEvento,
  addGasto,
  updateGasto,
  aprobarGasto,
  deleteGasto
};

