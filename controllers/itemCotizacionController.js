// controllers/itemCotizacionController.js
// -------------------- CONTROLADOR DE ITEMS DE COTIZACIÓN --------------------
import ItemCotizacionModel from '../models/ItemCotizacionModel.js';
import CotizacionModel from '../models/CotizacionModel.js';
import ProveedorModel from '../models/ProveedorModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR ITEMS --------------------
const listItems = asyncHandler(async (req, res) => {
  const { cotizacion, proveedor } = req.query;
  
  const filtros = {};
  if (cotizacion) filtros.cotizacion = cotizacion;
  if (proveedor) filtros.proveedor = proveedor;

  const items = await ItemCotizacionModel.getAll(filtros);
  
  res.json({
    total: items.length,
    items
  });
});

// -------------------- OBTENER ITEM POR ID --------------------
const getItem = asyncHandler(async (req, res) => {
  const item = await ItemCotizacionModel.getById(req.params.id);
  if (!item) {
    return res.status(404).json({
      mensaje: 'Item no encontrado',
      detalle: `No existe un item con el ID ${req.params.id}`
    });
  }
  res.json(item);
});

// -------------------- OBTENER ITEMS POR COTIZACIÓN --------------------
const getItemsByCotizacion = asyncHandler(async (req, res) => {
  const items = await ItemCotizacionModel.getByCotizacion(req.params.cotizacionId);
  res.json({
    total: items.length,
    items
  });
});

// -------------------- CREAR NUEVO ITEM --------------------
const addItem = asyncHandler(async (req, res) => {
  const { cotizacion, proveedor, descripcion, cantidad, precioUnitario, categoria, unidad } = req.body;

  // Validar que la cotización existe
  const cotizacionExiste = await CotizacionModel.getById(cotizacion);
  if (!cotizacionExiste) {
    return res.status(404).json({
      mensaje: 'Cotización no encontrada',
      detalle: `No existe una cotización con el ID ${cotizacion}`
    });
  }

  // Validar que el proveedor existe
  const proveedorExiste = await ProveedorModel.getById(proveedor);
  if (!proveedorExiste) {
    return res.status(404).json({
      mensaje: 'Proveedor no encontrado',
      detalle: `No existe un proveedor con el ID ${proveedor}`
    });
  }

  const nuevoItem = await ItemCotizacionModel.add(req.body);
  if (!nuevoItem) {
    return res.status(500).json({
      mensaje: 'Error al crear item',
      detalle: 'No se pudo crear el item en la base de datos'
    });
  }

  // Agregar item a la cotización y recalcular
  const itemsActuales = cotizacionExiste.items || [];
  itemsActuales.push(nuevoItem.id);
  await CotizacionModel.patch(cotizacion, { items: itemsActuales });
  await CotizacionModel.recalcularTotales(cotizacion);

  res.status(201).json({
    mensaje: 'Item creado exitosamente',
    item: nuevoItem
  });
});

// -------------------- ACTUALIZAR ITEM --------------------
const updateItem = asyncHandler(async (req, res) => {
  const actualizado = await ItemCotizacionModel.update(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Item no encontrado',
      detalle: `No existe un item con el ID ${req.params.id}`
    });
  }

  // Recalcular totales de la cotización
  if (actualizado.cotizacion) {
    await CotizacionModel.recalcularTotales(actualizado.cotizacion);
  }

  res.json({
    mensaje: 'Item actualizado exitosamente',
    item: actualizado
  });
});

// -------------------- ELIMINAR ITEM --------------------
const deleteItem = asyncHandler(async (req, res) => {
  const item = await ItemCotizacionModel.getById(req.params.id);
  if (!item) {
    return res.status(404).json({
      mensaje: 'Item no encontrado',
      detalle: `No existe un item con el ID ${req.params.id}`
    });
  }

  const eliminado = await ItemCotizacionModel.remove(req.params.id);

  // Actualizar cotización y recalcular
  if (item.cotizacion) {
    const cotizacion = await CotizacionModel.getById(item.cotizacion);
    if (cotizacion) {
      const itemsActualizados = (cotizacion.items || []).filter(
        id => String(id) !== String(item.id)
      );
      await CotizacionModel.patch(item.cotizacion, { items: itemsActualizados });
      await CotizacionModel.recalcularTotales(item.cotizacion);
    }
  }

  res.json({
    mensaje: 'Item eliminado exitosamente',
    item: eliminado
  });
});

export default {
  listItems,
  getItem,
  getItemsByCotizacion,
  addItem,
  updateItem,
  deleteItem
};

