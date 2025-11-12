// controllers/cotizacionController.js
// -------------------- CONTROLADOR DE COTIZACIONES --------------------
import CotizacionModel from '../models/CotizacionModel.js';
import ItemCotizacionModel from '../models/ItemCotizacionModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EventoModel from '../models/EventoModel.js';
import ProveedorModel from '../models/ProveedorModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generarPDFCotizacion } from '../utils/pdfGenerator.js';

// -------------------- LISTAR TODAS LAS COTIZACIONES --------------------
const listCotizaciones = asyncHandler(async (req, res) => {
  const { cliente, evento, estado } = req.query;
  
  const filtros = {};
  if (cliente) filtros.cliente = cliente;
  if (evento) filtros.evento = evento;
  if (estado) filtros.estado = estado;

  const cotizaciones = await CotizacionModel.getAll(filtros);
  
  res.json({
    total: cotizaciones.length,
    cotizaciones
  });
});

// -------------------- OBTENER COTIZACIÓN POR ID --------------------
const getCotizacion = asyncHandler(async (req, res) => {
  const cotizacion = await CotizacionModel.getById(req.params.id);
  if (!cotizacion) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }
  res.json(cotizacion);
});

// -------------------- OBTENER HISTORIAL DE VERSIONES --------------------
const getHistorial = asyncHandler(async (req, res) => {
  const historial = await CotizacionModel.getHistorial(req.params.id);
  if (historial.length === 0) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }
  res.json({
    total: historial.length,
    historial
  });
});

// -------------------- CREAR NUEVA COTIZACIÓN --------------------
const addCotizacion = asyncHandler(async (req, res) => {
  const { cliente, evento, items, margenPorcentaje, observaciones } = req.body;

  // Validar que cliente existe
  const clienteExiste = await ClienteModel.getById(cliente);
  if (!clienteExiste) {
    return res.status(404).json({
      mensaje: 'Cliente no encontrado',
      detalle: `No existe un cliente con el ID ${cliente}`
    });
  }

  // Validar que evento existe
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  // Crear items primero si se proporcionan
  let itemsIds = [];
  if (items && Array.isArray(items) && items.length > 0) {
    // Validar que todos los proveedores existen
    for (const item of items) {
      const proveedor = await ProveedorModel.getById(item.proveedor);
      if (!proveedor) {
        return res.status(404).json({
          mensaje: 'Proveedor no encontrado',
          detalle: `No existe un proveedor con el ID ${item.proveedor}`
        });
      }
    }

    const itemsCreados = await ItemCotizacionModel.addMultiple(items);
    itemsIds = itemsCreados.map(item => item.id);
  }

  // Calcular subtotal desde items
  let subtotal = 0;
  if (itemsIds.length > 0) {
    const itemsCompletos = await Promise.all(itemsIds.map(id => ItemCotizacionModel.getById(id)));
    subtotal = itemsCompletos.reduce((sum, item) => sum + (item?.subtotal || 0), 0);
  }

  // Crear cotización
  const nuevaCotizacion = await CotizacionModel.add({
    cliente,
    evento,
    items: itemsIds,
    subtotal,
    margenPorcentaje: margenPorcentaje || 20,
    estado: 'borrador',
    observaciones: observaciones || '',
    creadoPor: req.user?.id || req.body.creadoPor
  });

  if (!nuevaCotizacion) {
    // Si falla, eliminar items creados
    if (itemsIds.length > 0) {
      await Promise.all(itemsIds.map(id => ItemCotizacionModel.remove(id)));
    }
    return res.status(500).json({
      mensaje: 'Error al crear cotización',
      detalle: 'No se pudo crear la cotización en la base de datos'
    });
  }

  // Actualizar items con el ID de la cotización
  if (itemsIds.length > 0) {
    await Promise.all(
      itemsIds.map(id => 
        ItemCotizacionModel.patch(id, { cotizacion: nuevaCotizacion.id })
      )
    );
  }

  // Recalcular totales
  await CotizacionModel.recalcularTotales(nuevaCotizacion.id);
  const cotizacionCompleta = await CotizacionModel.getById(nuevaCotizacion.id);

  res.status(201).json({
    mensaje: 'Cotización creada exitosamente',
    cotizacion: cotizacionCompleta
  });
});

// -------------------- ACTUALIZAR COTIZACIÓN --------------------
const updateCotizacion = asyncHandler(async (req, res) => {
  const { items, ...otrosCampos } = req.body;

  // Si se actualizan items, manejarlos por separado
  if (items && Array.isArray(items)) {
    // Eliminar items antiguos
    await ItemCotizacionModel.removeByCotizacion(req.params.id);
    
    // Crear nuevos items
    const itemsCreados = await ItemCotizacionModel.addMultiple(
      items.map(item => ({ ...item, cotizacion: req.params.id }))
    );
    otrosCampos.items = itemsCreados.map(item => item.id);
  }

  const actualizada = await CotizacionModel.update(req.params.id, otrosCampos);
  if (!actualizada) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }

  // Recalcular totales
  await CotizacionModel.recalcularTotales(req.params.id);
  const cotizacionCompleta = await CotizacionModel.getById(req.params.id);

  res.json({
    mensaje: 'Cotización actualizada exitosamente',
    cotizacion: cotizacionCompleta
  });
});

// -------------------- CREAR NUEVA VERSIÓN --------------------
const crearVersion = asyncHandler(async (req, res) => {
  const { items, ...otrosCampos } = req.body;

  // Crear nueva versión
  const nuevaVersion = await CotizacionModel.crearVersion(req.params.id, {
    ...otrosCampos,
    creadoPor: req.user?.id || req.body.creadoPor
  });

  if (!nuevaVersion) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }

  // Si se proporcionan items, agregarlos
  if (items && Array.isArray(items) && items.length > 0) {
    const itemsCreados = await ItemCotizacionModel.addMultiple(
      items.map(item => ({ ...item, cotizacion: nuevaVersion.id }))
    );
    
    await CotizacionModel.patch(nuevaVersion.id, {
      items: itemsCreados.map(item => item.id)
    });
  }

  // Recalcular totales
  await CotizacionModel.recalcularTotales(nuevaVersion.id);
  const cotizacionCompleta = await CotizacionModel.getById(nuevaVersion.id);

  res.status(201).json({
    mensaje: 'Nueva versión de cotización creada exitosamente',
    cotizacion: cotizacionCompleta
  });
});

// -------------------- APROBAR COTIZACIÓN --------------------
const aprobarCotizacion = asyncHandler(async (req, res) => {
  const aprobada = await CotizacionModel.aprobar(
    req.params.id,
    req.user?.id || req.body.aprobadoPor
  );

  if (!aprobada) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Cotización aprobada exitosamente',
    cotizacion: aprobada
  });
});

// -------------------- ENVIAR COTIZACIÓN --------------------
const enviarCotizacion = asyncHandler(async (req, res) => {
  const { fechaVencimiento } = req.body;

  const actualizada = await CotizacionModel.patch(req.params.id, {
    estado: 'pendiente',
    fechaEnvio: new Date(),
    fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null
  });

  if (!actualizada) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Cotización enviada exitosamente',
    cotizacion: actualizada
  });
});

// -------------------- RECALCULAR TOTALES --------------------
const recalcularTotales = asyncHandler(async (req, res) => {
  const recalculada = await CotizacionModel.recalcularTotales(req.params.id);
  
  if (!recalculada) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Totales recalculados exitosamente',
    cotizacion: recalculada
  });
});

// -------------------- GENERAR PDF DE COTIZACIÓN --------------------
const generarPDF = asyncHandler(async (req, res) => {
  const cotizacion = await CotizacionModel.getById(req.params.id);
  if (!cotizacion) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }

  try {
    const pdfBuffer = await generarPDFCotizacion(cotizacion);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cotizacion-${cotizacion.numero}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return res.status(500).json({
      mensaje: 'Error al generar PDF',
      detalle: 'No se pudo generar el PDF de la cotización'
    });
  }
});

// -------------------- ELIMINAR COTIZACIÓN --------------------
const deleteCotizacion = asyncHandler(async (req, res) => {
  // Eliminar items asociados
  await ItemCotizacionModel.removeByCotizacion(req.params.id);
  
  const eliminada = await CotizacionModel.remove(req.params.id);
  if (!eliminada) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${req.params.id}`
    });
  }

  res.json({
    mensaje: 'Cotización eliminada exitosamente',
    cotizacion: eliminada
  });
});

export default {
  listCotizaciones,
  getCotizacion,
  getHistorial,
  addCotizacion,
  updateCotizacion,
  crearVersion,
  aprobarCotizacion,
  enviarCotizacion,
  recalcularTotales,
  generarPDF,
  deleteCotizacion
};

