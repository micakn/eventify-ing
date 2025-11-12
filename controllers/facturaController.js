// controllers/facturaController.js
// -------------------- CONTROLADOR DE FACTURAS --------------------
import FacturaClienteModel from '../models/FacturaClienteModel.js';
import ItemFacturaModel from '../models/ItemFacturaModel.js';
import GastoModel from '../models/GastoModel.js';
import EventoModel from '../models/EventoModel.js';
import CotizacionModel from '../models/CotizacionModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR FACTURAS --------------------
const listFacturas = asyncHandler(async (req, res) => {
  const { cliente, evento, estado, fechaDesde, fechaHasta } = req.query;
  
  const filtros = {};
  if (cliente) filtros.cliente = cliente;
  if (evento) filtros.evento = evento;
  if (estado) filtros.estado = estado;
  if (fechaDesde) filtros.fechaDesde = fechaDesde;
  if (fechaHasta) filtros.fechaHasta = fechaHasta;

  const facturas = await FacturaClienteModel.getAll(filtros);
  
  res.json({
    total: facturas.length,
    facturas
  });
});

// -------------------- OBTENER FACTURA POR ID --------------------
const getFactura = asyncHandler(async (req, res) => {
  const factura = await FacturaClienteModel.getById(req.params.id);
  if (!factura) {
    return res.status(404).json({
      mensaje: 'Factura no encontrada',
      detalle: `No existe una factura con el ID ${req.params.id}`
    });
  }
  res.json(factura);
});

// -------------------- OBTENER FACTURAS POR EVENTO --------------------
const getFacturasPorEvento = asyncHandler(async (req, res) => {
  const facturas = await FacturaClienteModel.getByEvento(req.params.eventoId);
  
  res.json({
    total: facturas.length,
    facturas
  });
});

// -------------------- GENERAR FACTURA DESDE GASTOS --------------------
const generarFacturaDesdeGastos = asyncHandler(async (req, res) => {
  const { evento, margenPorcentaje, cliente } = req.body;

  if (!evento) {
    return res.status(400).json({
      mensaje: 'Evento requerido',
      detalle: 'Debe proporcionar el ID del evento'
    });
  }

  // Validar que el evento existe
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  // Obtener cliente del evento o del body
  const clienteId = cliente || eventoExiste.cliente;
  if (!clienteId) {
    return res.status(400).json({
      mensaje: 'Cliente requerido',
      detalle: 'El evento debe tener un cliente asociado o debe proporcionar uno'
    });
  }

  // Obtener gastos del evento
  const gastos = await GastoModel.getByEvento(evento);
  if (gastos.length === 0) {
    return res.status(400).json({
      mensaje: 'No hay gastos para facturar',
      detalle: 'El evento no tiene gastos asociados'
    });
  }

  // Crear factura
  const factura = await FacturaClienteModel.add({
    cliente: clienteId,
    evento: evento,
    margenPorcentaje: margenPorcentaje || 20,
    estado: 'borrador',
    fechaEmision: new Date(),
    fechaVencimiento: req.body.fechaVencimiento || null
  });

  if (!factura) {
    return res.status(500).json({
      mensaje: 'Error al crear factura',
      detalle: 'No se pudo crear la factura en la base de datos'
    });
  }

  // Crear items de factura desde gastos
  const items = [];
  for (const gasto of gastos) {
    if (gasto.estado !== 'cancelado') {
      const item = await ItemFacturaModel.add({
        factura: factura.id,
        descripcion: gasto.descripcion,
        categoria: gasto.categoria,
        cantidad: 1,
        precioUnitario: gasto.monto,
        iva: gasto.iva,
        orden: items.length + 1
      });
      if (item) {
        items.push(item);
      }
    }
  }

  // Actualizar factura con items
  await FacturaClienteModel.patch(factura.id, { items: items.map(i => i.id) });

  // Recalcular total
  await FacturaClienteModel.recalcularTotal(factura.id);

  // Obtener factura completa
  const facturaCompleta = await FacturaClienteModel.getById(factura.id);

  res.status(201).json({
    mensaje: 'Factura generada exitosamente desde gastos',
    factura: facturaCompleta
  });
});

// -------------------- GENERAR FACTURA DESDE COTIZACIÓN --------------------
const generarFacturaDesdeCotizacion = asyncHandler(async (req, res) => {
  const { cotizacion, margenPorcentaje } = req.body;

  if (!cotizacion) {
    return res.status(400).json({
      mensaje: 'Cotización requerida',
      detalle: 'Debe proporcionar el ID de la cotización'
    });
  }

  // Validar que la cotización existe
  const cotizacionExiste = await CotizacionModel.getById(cotizacion);
  if (!cotizacionExiste) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${cotizacion}`
    });
  }

  if (cotizacionExiste.estado !== 'aprobada') {
    return res.status(400).json({
      mensaje: 'Cotización no aprobada',
      detalle: 'Solo se pueden generar facturas desde cotizaciones aprobadas'
    });
  }

  // Crear factura
  const factura = await FacturaClienteModel.add({
    cliente: cotizacionExiste.cliente,
    evento: cotizacionExiste.evento,
    cotizacion: cotizacion,
    margenPorcentaje: margenPorcentaje || cotizacionExiste.margenPorcentaje || 20,
    estado: 'borrador',
    fechaEmision: new Date(),
    fechaVencimiento: req.body.fechaVencimiento || null
  });

  if (!factura) {
    return res.status(500).json({
      mensaje: 'Error al crear factura',
      detalle: 'No se pudo crear la factura en la base de datos'
    });
  }

  // Obtener items de la cotización
  const ItemCotizacionModel = (await import('../models/ItemCotizacionModel.js')).default;
  const itemsCotizacion = await ItemCotizacionModel.getByCotizacion(cotizacion);

  // Crear items de factura desde cotización
  const items = [];
  for (const itemCot of itemsCotizacion) {
    // Calcular IVA si no existe (21% por defecto en Argentina)
    const iva = itemCot.iva !== undefined ? itemCot.iva : (itemCot.subtotal * 0.21);
    
    const item = await ItemFacturaModel.add({
      factura: factura.id,
      descripcion: itemCot.descripcion,
      categoria: itemCot.categoria || 'Otros',
      cantidad: itemCot.cantidad || 1,
      precioUnitario: itemCot.precioUnitario || 0,
      iva: iva,
      orden: items.length + 1
    });
    if (item) {
      items.push(item);
    }
  }

  // Actualizar factura con items
  await FacturaClienteModel.patch(factura.id, { items: items.map(i => i.id) });

  // Recalcular total
  await FacturaClienteModel.recalcularTotal(factura.id);

  // Obtener factura completa
  const facturaCompleta = await FacturaClienteModel.getById(factura.id);

  res.status(201).json({
    mensaje: 'Factura generada exitosamente desde cotización',
    factura: facturaCompleta
  });
});

// -------------------- CREAR FACTURA --------------------
const addFactura = asyncHandler(async (req, res) => {
  const { cliente, evento } = req.body;

  // Validar que el evento existe
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  const nuevaFactura = await FacturaClienteModel.add(req.body);
  if (!nuevaFactura) {
    return res.status(500).json({
      mensaje: 'Error al crear factura',
      detalle: 'No se pudo crear la factura en la base de datos'
    });
  }

  res.status(201).json({
    mensaje: 'Factura creada exitosamente',
    factura: nuevaFactura
  });
});

// -------------------- ACTUALIZAR FACTURA --------------------
const updateFactura = asyncHandler(async (req, res) => {
  try {
    const actualizada = await FacturaClienteModel.update(req.params.id, req.body);
    if (!actualizada) {
      return res.status(404).json({
        mensaje: 'Factura no encontrada',
        detalle: `No existe una factura con el ID ${req.params.id}`
      });
    }
    res.json({
      mensaje: 'Factura actualizada exitosamente',
      factura: actualizada
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

// -------------------- APROBAR FACTURA --------------------
const aprobarFactura = asyncHandler(async (req, res) => {
  const { empleadoId } = req.body;
  
  if (!empleadoId) {
    return res.status(400).json({
      mensaje: 'Empleado requerido',
      detalle: 'Debe proporcionar el ID del empleado que aprueba la factura'
    });
  }

  const aprobada = await FacturaClienteModel.aprobar(req.params.id, empleadoId);
  if (!aprobada) {
    return res.status(404).json({
      mensaje: 'Factura no encontrada',
      detalle: `No existe una factura con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Factura aprobada exitosamente',
    factura: aprobada
  });
});

// -------------------- MARCAR COMO PAGADA --------------------
const marcarComoPagada = asyncHandler(async (req, res) => {
  const { fechaPago } = req.body;

  const actualizada = await FacturaClienteModel.marcarComoPagada(req.params.id, fechaPago);
  if (!actualizada) {
    return res.status(404).json({
      mensaje: 'Factura no encontrada',
      detalle: `No existe una factura con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Factura marcada como pagada exitosamente',
    factura: actualizada
  });
});

// -------------------- OBTENER REPORTE DE RENTABILIDAD --------------------
const getReporteRentabilidad = asyncHandler(async (req, res) => {
  const { evento } = req.query;
  
  if (!evento) {
    return res.status(400).json({
      mensaje: 'Evento requerido',
      detalle: 'Debe proporcionar el ID del evento'
    });
  }

  // Obtener evento
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  // Obtener gastos
  const gastos = await GastoModel.getByEvento(evento);
  const resumenGastos = await GastoModel.getResumenPorEvento(evento);

  // Obtener facturas
  const facturas = await FacturaClienteModel.getByEvento(evento);

  // Calcular ingresos
  const ingresos = facturas
    .filter(f => f.estado !== 'cancelada')
    .reduce((sum, f) => sum + (f.total || 0), 0);

  // Calcular gastos
  const totalGastos = resumenGastos?.totalGastos || 0;

  // Calcular rentabilidad
  const rentabilidad = ingresos - totalGastos;
  const rentabilidadPorcentaje = ingresos > 0 
    ? ((rentabilidad / ingresos) * 100).toFixed(2)
    : 0;

  // Varianza por categoría
  const varianzaPorCategoria = {};
  const gastosPorCategoria = resumenGastos?.porCategoria || {};
  
  facturas.forEach(factura => {
    if (factura.items) {
      factura.items.forEach(item => {
        const categoria = item.categoria || 'Otros';
        if (!varianzaPorCategoria[categoria]) {
          varianzaPorCategoria[categoria] = {
            ingresos: 0,
            gastos: 0,
            rentabilidad: 0
          };
        }
        varianzaPorCategoria[categoria].ingresos += item.total || 0;
      });
    }
  });

  Object.keys(gastosPorCategoria).forEach(categoria => {
    if (!varianzaPorCategoria[categoria]) {
      varianzaPorCategoria[categoria] = {
        ingresos: 0,
        gastos: 0,
        rentabilidad: 0
      };
    }
    varianzaPorCategoria[categoria].gastos = gastosPorCategoria[categoria].total || 0;
    varianzaPorCategoria[categoria].rentabilidad = 
      varianzaPorCategoria[categoria].ingresos - varianzaPorCategoria[categoria].gastos;
  });

  const reporte = {
    evento: {
      id: eventoExiste.id,
      nombre: eventoExiste.nombre,
      fechaInicio: eventoExiste.fechaInicio,
      fechaFin: eventoExiste.fechaFin,
      presupuesto: eventoExiste.presupuesto || 0
    },
    ingresos: {
      total: ingresos,
      facturas: facturas.length,
      facturasPagadas: facturas.filter(f => f.estado === 'pagada').length
    },
    gastos: {
      total: totalGastos,
      pagados: resumenGastos?.totalPagado || 0,
      pendientes: resumenGastos?.totalPendiente || 0,
      vencidos: resumenGastos?.totalVencido || 0,
      cantidad: resumenGastos?.cantidad || 0
    },
    rentabilidad: {
      total: rentabilidad,
      porcentaje: rentabilidadPorcentaje,
      margen: ingresos > 0 ? ((rentabilidad / ingresos) * 100).toFixed(2) : 0
    },
    varianzaPorCategoria,
    desvioPresupuesto: {
      presupuesto: eventoExiste.presupuesto || 0,
      gastosReales: totalGastos,
      desvio: totalGastos - (eventoExiste.presupuesto || 0),
      desvioPorcentaje: eventoExiste.presupuesto > 0 
        ? (((totalGastos - eventoExiste.presupuesto) / eventoExiste.presupuesto) * 100).toFixed(2)
        : 0,
      alerta: Math.abs((totalGastos - (eventoExiste.presupuesto || 0)) / (eventoExiste.presupuesto || 1) * 100) > 10
    }
  };

  res.json({
    evento: evento,
    reporte
  });
});

// -------------------- ELIMINAR FACTURA --------------------
const deleteFactura = asyncHandler(async (req, res) => {
  const eliminada = await FacturaClienteModel.remover(req.params.id);
  if (!eliminada) {
    return res.status(404).json({
      mensaje: 'Factura no encontrada',
      detalle: `No existe una factura con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Factura eliminada exitosamente',
    factura: eliminada
  });
});

export default {
  listFacturas,
  getFactura,
  getFacturasPorEvento,
  generarFacturaDesdeGastos,
  generarFacturaDesdeCotizacion,
  addFactura,
  updateFactura,
  aprobarFactura,
  marcarComoPagada,
  getReporteRentabilidad,
  deleteFactura
};

