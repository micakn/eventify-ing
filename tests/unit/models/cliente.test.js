// tests/unit/models/cliente.test.js
// -------------------- TESTS UNITARIOS: MODELO CLIENTE --------------------
import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import ClienteModel from '../../../models/ClienteModel.js';
import mongoose from 'mongoose';

describe('ClienteModel', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de pruebas
    if (mongoose.connection.readyState === 0) {
      const { connectMongo } = await import('../../../db/mongoose.js');
      await connectMongo(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify-test');
    }
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('add', () => {
    it('debe crear un nuevo cliente', async () => {
      const clienteData = {
        nombre: 'Cliente Test',
        email: `test-${Date.now()}@test.com`,
        telefono: '1234567890',
        direccion: 'Dirección Test',
        condicionImpositiva: 'Responsable Inscripto'
      };

      const cliente = await ClienteModel.add(clienteData);

      expect(cliente).not.toBeNull();
      expect(cliente).toHaveProperty('id');
      expect(cliente).toHaveProperty('nombre', clienteData.nombre);
      expect(cliente).toHaveProperty('email', clienteData.email);
    });

    it('debe crear cliente con datos mínimos', async () => {
      const clienteData = {
        nombre: 'Cliente Mínimo',
        email: `minimo-${Date.now()}@test.com`
      };

      const cliente = await ClienteModel.add(clienteData);

      expect(cliente).not.toBeNull();
      expect(cliente).toHaveProperty('id');
      expect(cliente).toHaveProperty('nombre', clienteData.nombre);
    });
  });

  describe('getAll', () => {
    it('debe obtener todos los clientes', async () => {
      // Crear algunos clientes
      await ClienteModel.add({ nombre: 'Cliente 1', email: 'cliente1@test.com' });
      await ClienteModel.add({ nombre: 'Cliente 2', email: 'cliente2@test.com' });
      await ClienteModel.add({ nombre: 'Cliente 3', email: 'cliente3@test.com' });

      const clientes = await ClienteModel.getAll();

      expect(Array.isArray(clientes)).toBe(true);
      expect(clientes.length).toBe(3);
    });

    it('debe devolver array vacío si no hay clientes', async () => {
      const clientes = await ClienteModel.getAll();

      expect(Array.isArray(clientes)).toBe(true);
      expect(clientes.length).toBe(0);
    });
  });

  describe('getById', () => {
    it('debe obtener un cliente por ID', async () => {
      const cliente = await ClienteModel.add({
        nombre: 'Cliente Test',
        email: `test-${Date.now()}@test.com`
      });

      const clienteObtenido = await ClienteModel.getById(cliente.id);

      expect(clienteObtenido).not.toBeNull();
      expect(clienteObtenido).toHaveProperty('id', cliente.id);
      expect(clienteObtenido).toHaveProperty('nombre', 'Cliente Test');
    });

    it('debe devolver null si el cliente no existe', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const cliente = await ClienteModel.getById(idInexistente);

      expect(cliente).toBeNull();
    });

    it('debe devolver null si el ID es inválido', async () => {
      const cliente = await ClienteModel.getById('id-invalido');

      expect(cliente).toBeNull();
    });
  });

  describe('update', () => {
    it('debe actualizar un cliente existente', async () => {
      const cliente = await ClienteModel.add({
        nombre: 'Cliente Original',
        email: `original-${Date.now()}@test.com`
      });

      const datosActualizados = {
        nombre: 'Cliente Actualizado',
        email: `actualizado-${Date.now()}@test.com`
      };

      const clienteActualizado = await ClienteModel.update(cliente.id, datosActualizados);

      expect(clienteActualizado).not.toBeNull();
      expect(clienteActualizado).toHaveProperty('nombre', datosActualizados.nombre);
      expect(clienteActualizado).toHaveProperty('email', datosActualizados.email);
    });

    it('debe devolver null si el cliente no existe', async () => {
      const idInexistente = new mongoose.Types.ObjectId();

      const cliente = await ClienteModel.update(idInexistente, { nombre: 'Actualizado' });

      expect(cliente).toBeNull();
    });
  });

  describe('patch', () => {
    it('debe actualizar parcialmente un cliente', async () => {
      const cliente = await ClienteModel.add({
        nombre: 'Cliente Original',
        email: `original-${Date.now()}@test.com`,
        telefono: '1234567890'
      });

      const clienteActualizado = await ClienteModel.patch(cliente.id, {
        telefono: '9876543210'
      });

      expect(clienteActualizado).not.toBeNull();
      expect(clienteActualizado).toHaveProperty('nombre', 'Cliente Original');
      expect(clienteActualizado).toHaveProperty('telefono', '9876543210');
    });
  });

  describe('remover', () => {
    it('debe eliminar un cliente existente', async () => {
      const cliente = await ClienteModel.add({
        nombre: 'Cliente a Eliminar',
        email: `eliminar-${Date.now()}@test.com`
      });

      const clienteEliminado = await ClienteModel.remover(cliente.id);

      expect(clienteEliminado).not.toBeNull();
      expect(clienteEliminado).toHaveProperty('id', cliente.id);

      // Verificar que el cliente fue eliminado
      const clienteVerificado = await ClienteModel.getById(cliente.id);
      expect(clienteVerificado).toBeNull();
    });

    it('debe devolver null si el cliente no existe', async () => {
      const idInexistente = new mongoose.Types.ObjectId();

      const cliente = await ClienteModel.remover(idInexistente);

      expect(cliente).toBeNull();
    });
  });
});

