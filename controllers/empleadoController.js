// controllers/empleadoController.js
// -------------------- CONTROLADOR DE EMPLEADOS --------------------
import EmpleadoModel from '../models/EmpleadoModel.js';
import { ROLES_ARRAY, AREAS_ARRAY } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// -------------------- LISTAR TODOS LOS EMPLEADOS --------------------
const listEmpleados = asyncHandler(async (req, res) => {
  const empleados = await EmpleadoModel.getAll();
  res.json({
    total: empleados.length,
    empleados
  });
});

// -------------------- OBTENER EMPLEADO POR ID --------------------
const getEmpleado = asyncHandler(async (req, res) => {
  const empleado = await EmpleadoModel.getById(req.params.id);
  if (!empleado) {
    return res.status(404).json({
      mensaje: 'Empleado no encontrado',
      detalle: `No existe un empleado con el ID ${req.params.id}`
    });
  }
  res.json(empleado);
});

// -------------------- CREAR NUEVO EMPLEADO --------------------
const addEmpleado = asyncHandler(async (req, res) => {
  const nuevoEmpleado = await EmpleadoModel.add(req.body);
  if (!nuevoEmpleado) {
    return res.status(500).json({
      mensaje: 'Error al crear empleado',
      detalle: 'No se pudo crear el empleado en la base de datos'
    });
  }
  res.status(201).json({
    mensaje: 'Empleado creado exitosamente',
    empleado: nuevoEmpleado
  });
});

// -------------------- ACTUALIZAR COMPLETAMENTE EMPLEADO --------------------
const updateEmpleado = asyncHandler(async (req, res) => {
  const actualizado = await EmpleadoModel.update(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Empleado no encontrado',
      detalle: `No existe un empleado con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Empleado actualizado exitosamente',
    empleado: actualizado
  });
});

// -------------------- ACTUALIZAR PARCIALMENTE EMPLEADO --------------------
const patchEmpleado = asyncHandler(async (req, res) => {
  const actualizado = await EmpleadoModel.patch(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Empleado no encontrado',
      detalle: `No existe un empleado con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Empleado actualizado parcialmente',
    empleado: actualizado
  });
});

// -------------------- ELIMINAR EMPLEADO --------------------
const deleteEmpleado = asyncHandler(async (req, res) => {
  const eliminado = await EmpleadoModel.remove(req.params.id);
  if (!eliminado) {
    return res.status(404).json({
      mensaje: 'Empleado no encontrado',
      detalle: `No existe un empleado con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Empleado eliminado exitosamente',
    empleado: eliminado
  });
});

export default { listEmpleados, getEmpleado, addEmpleado, updateEmpleado, patchEmpleado, deleteEmpleado };
