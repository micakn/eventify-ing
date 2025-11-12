// controllers/proveedorController.js
// -------------------- CONTROLADOR DE PROVEEDORES --------------------
import ProveedorModel from '../models/ProveedorModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR TODOS LOS PROVEEDORES --------------------
const listProveedores = asyncHandler(async (req, res) => {
  const { servicio, activo } = req.query;
  
  let proveedores;
  if (servicio) {
    proveedores = await ProveedorModel.getByServicio(servicio);
  } else {
    proveedores = await ProveedorModel.getAll();
  }

  // Filtrar por activo si se especifica
  if (activo !== undefined) {
    const activoBool = activo === 'true';
    proveedores = proveedores.filter(p => p.activo === activoBool);
  }

  res.json({
    total: proveedores.length,
    proveedores
  });
});

// -------------------- OBTENER PROVEEDOR POR ID --------------------
const getProveedor = asyncHandler(async (req, res) => {
  const proveedor = await ProveedorModel.getById(req.params.id);
  if (!proveedor) {
    return res.status(404).json({
      mensaje: 'Proveedor no encontrado',
      detalle: `No existe un proveedor con el ID ${req.params.id}`
    });
  }
  res.json(proveedor);
});

// -------------------- CREAR NUEVO PROVEEDOR --------------------
const addProveedor = asyncHandler(async (req, res) => {
  const nuevoProveedor = await ProveedorModel.add(req.body);
  if (!nuevoProveedor) {
    return res.status(500).json({
      mensaje: 'Error al crear proveedor',
      detalle: 'No se pudo crear el proveedor en la base de datos'
    });
  }
  res.status(201).json({
    mensaje: 'Proveedor creado exitosamente',
    proveedor: nuevoProveedor
  });
});

// -------------------- ACTUALIZAR PROVEEDOR COMPLETO --------------------
const updateProveedor = asyncHandler(async (req, res) => {
  const actualizado = await ProveedorModel.update(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Proveedor no encontrado',
      detalle: `No existe un proveedor con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Proveedor actualizado exitosamente',
    proveedor: actualizado
  });
});

// -------------------- ACTUALIZAR PARCIALMENTE PROVEEDOR --------------------
const patchProveedor = asyncHandler(async (req, res) => {
  const actualizado = await ProveedorModel.patch(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Proveedor no encontrado',
      detalle: `No existe un proveedor con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Proveedor actualizado parcialmente',
    proveedor: actualizado
  });
});

// -------------------- ELIMINAR PROVEEDOR --------------------
const deleteProveedor = asyncHandler(async (req, res) => {
  const eliminado = await ProveedorModel.remove(req.params.id);
  if (!eliminado) {
    return res.status(404).json({
      mensaje: 'Proveedor no encontrado',
      detalle: `No existe un proveedor con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Proveedor eliminado exitosamente',
    proveedor: eliminado
  });
});

export default {
  listProveedores,
  getProveedor,
  addProveedor,
  updateProveedor,
  patchProveedor,
  deleteProveedor
};

