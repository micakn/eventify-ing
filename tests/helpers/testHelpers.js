// tests/helpers/testHelpers.js
// -------------------- FUNCIONES AUXILIARES PARA TESTS --------------------
import mongoose from 'mongoose';
import UsuarioModel from '../../models/UsuarioModel.js';
import EmpleadoModel from '../../models/EmpleadoModel.js';
import ClienteModel from '../../models/ClienteModel.js';
import EventoModel from '../../models/EventoModel.js';
import { generateToken } from '../../middleware/auth.js';

/**
 * Crear un empleado de prueba
 */
export async function crearEmpleadoTest(datos = {}) {
  const empleadoData = {
    nombre: datos.nombre || 'Juan Pérez',
    email: datos.email || `test-${Date.now()}@test.com`,
    telefono: datos.telefono || '1234567890',
    rol: datos.rol || 'planner',
    area: datos.area || 'Planificación y Finanzas',
    ...datos
  };
  
  return await EmpleadoModel.add(empleadoData);
}

/**
 * Crear un usuario de prueba
 */
export async function crearUsuarioTest(datos = {}) {
  const empleado = datos.empleado || await crearEmpleadoTest();
  
  const usuarioData = {
    email: datos.email || `usuario-${Date.now()}@test.com`,
    password: datos.password || 'password123',
    rol: datos.rol || 'planner',
    empleado: empleado.id,
    ...datos
  };
  
  return await UsuarioModel.add(usuarioData);
}

/**
 * Crear un token JWT para un usuario
 */
export async function crearTokenTest(usuario) {
  const usuarioCompleto = typeof usuario === 'string' 
    ? await UsuarioModel.getById(usuario)
    : usuario;
  
  return generateToken(usuarioCompleto);
}

/**
 * Crear un cliente de prueba
 */
export async function crearClienteTest(datos = {}) {
  const clienteData = {
    nombre: datos.nombre || 'Cliente Test',
    email: datos.email || `cliente-${Date.now()}@test.com`,
    telefono: datos.telefono || '1234567890',
    direccion: datos.direccion || 'Dirección Test',
    condicionImpositiva: datos.condicionImpositiva || 'Responsable Inscripto',
    ...datos
  };
  
  return await ClienteModel.add(clienteData);
}

/**
 * Crear un evento de prueba
 */
export async function crearEventoTest(datos = {}) {
  const cliente = datos.cliente || await crearClienteTest();
  
  const eventoData = {
    nombre: datos.nombre || 'Evento Test',
    fechaInicio: datos.fechaInicio || new Date(),
    fechaFin: datos.fechaFin || new Date(Date.now() + 86400000), // +1 día
    lugar: datos.lugar || 'Lugar Test',
    descripcion: datos.descripcion || 'Descripción Test',
    presupuesto: datos.presupuesto || 10000,
    cliente: cliente.id,
    estado: datos.estado || 'planificacion',
    ...datos
  };
  
  return await EventoModel.add(eventoData);
}

/**
 * Limpiar la base de datos
 */
export async function limpiarBaseDatos() {
  const mongoose = (await import('mongoose')).default;
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

/**
 * Verificar que un ID es válido
 */
export function esIdValido(id) {
  return mongoose.isValidObjectId(id);
}

/**
 * Esperar un tiempo determinado
 */
export function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

