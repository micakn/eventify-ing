// controllers/clienteController.js
// -------------------- CONTROLADOR DE CLIENTES --------------------
import ClienteModel from '../models/ClienteModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR TODOS LOS CLIENTES --------------------
const listClientes = asyncHandler(async (req, res) => {
  const clientes = await ClienteModel.getAll();
  res.json({
    total: clientes.length,
    clientes
  });
});

// -------------------- OBTENER CLIENTE POR ID --------------------
const getCliente = asyncHandler(async (req, res) => {
  const cliente = await ClienteModel.getById(req.params.id);
  if (!cliente) {
    return res.status(404).json({
      mensaje: 'Cliente no encontrado',
      detalle: `No existe un cliente con el ID ${req.params.id}`
    });
  }
  res.json(cliente);
});

// -------------------- CREAR NUEVO CLIENTE --------------------
const addCliente = asyncHandler(async (req, res) => {
  const nuevoCliente = await ClienteModel.add(req.body);
  if (!nuevoCliente) {
    return res.status(500).json({
      mensaje: 'Error al crear cliente',
      detalle: 'No se pudo crear el cliente en la base de datos'
    });
  }
  res.status(201).json({
    mensaje: 'Cliente creado exitosamente',
    cliente: nuevoCliente
  });
});

// -------------------- ACTUALIZAR CLIENTE COMPLETO --------------------
const updateCliente = asyncHandler(async (req, res) => {
  const actualizado = await ClienteModel.update(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Cliente no encontrado',
      detalle: `No existe un cliente con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Cliente actualizado exitosamente',
    cliente: actualizado
  });
});

// -------------------- ACTUALIZAR PARCIALMENTE CLIENTE --------------------
const patchCliente = asyncHandler(async (req, res) => {
  const actualizado = await ClienteModel.patch(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Cliente no encontrado',
      detalle: `No existe un cliente con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Cliente actualizado parcialmente',
    cliente: actualizado
  });
});

// -------------------- ELIMINAR CLIENTE --------------------
const deleteCliente = asyncHandler(async (req, res) => {
  const eliminado = await ClienteModel.remove(req.params.id);
  if (!eliminado) {
    return res.status(404).json({
      mensaje: 'Cliente no encontrado',
      detalle: `No existe un cliente con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Cliente eliminado exitosamente',
    cliente: eliminado
  });
});

export default { listClientes, getCliente, addCliente, updateCliente, patchCliente, deleteCliente };
