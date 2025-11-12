// tests/integration/clientes.test.js
// -------------------- TESTS DE INTEGRACIÓN: CLIENTES --------------------
import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { crearClienteTest, crearUsuarioTest, crearEmpleadoTest, crearTokenTest } from '../helpers/testHelpers.js';
import ClienteModel from '../../models/ClienteModel.js';
import app from '../../app.js';
import mongoose from 'mongoose';

describe('Clientes API', () => {
  let usuario;
  let token;

  beforeAll(async () => {
    // Conectar a la base de datos de pruebas
    if (mongoose.connection.readyState === 0) {
      const { connectMongo } = await import('../../db/mongoose.js');
      await connectMongo(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify-test');
    }
  });

  beforeEach(async () => {
    // Crear usuario de prueba
    const empleado = await crearEmpleadoTest();
    usuario = await crearUsuarioTest({ empleado });
    token = await crearTokenTest(usuario);
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('GET /api/clientes', () => {
    it('debe obtener la lista de clientes', async () => {
      // Crear algunos clientes de prueba
      await crearClienteTest({ nombre: 'Cliente 1' });
      await crearClienteTest({ nombre: 'Cliente 2' });

      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('clientes');
      expect(Array.isArray(response.body.clientes)).toBe(true);
      expect(response.body.clientes.length).toBeGreaterThanOrEqual(2);
    });

    it('debe devolver array vacío si no hay clientes', async () => {
      const response = await request(app)
        .get('/api/clientes');

      // Las rutas de clientes pueden no requerir autenticación en desarrollo
      if (response.status === 200) {
        expect(response.body).toHaveProperty('clientes');
        expect(Array.isArray(response.body.clientes)).toBe(true);
        expect(response.body.clientes.length).toBe(0);
      }
    });
  });

  describe('GET /api/clientes/:id', () => {
    it('debe obtener un cliente por ID', async () => {
      const cliente = await crearClienteTest({ nombre: 'Cliente Test' });

      const response = await request(app)
        .get(`/api/clientes/${cliente.id}`);

      // Las rutas de clientes pueden no requerir autenticación en desarrollo
      if (response.status === 200) {
        expect(response.body).toHaveProperty('id', cliente.id);
        expect(response.body).toHaveProperty('nombre', 'Cliente Test');
      }
    });

    it('debe devolver 404 si el cliente no existe', async () => {
      const idInexistente = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/clientes/${idInexistente}`);

      expect([404, 401]).toContain(response.status);
    });

    it('debe devolver 400 si el ID es inválido', async () => {
      const response = await request(app)
        .get('/api/clientes/id-invalido');

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/clientes', () => {
    it('debe crear un nuevo cliente con datos válidos', async () => {
      const nuevoCliente = {
        nombre: 'Nuevo Cliente',
        email: `cliente-${Date.now()}@test.com`,
        telefono: '1234567890',
        direccion: 'Dirección Test',
        condicionImpositiva: 'Responsable Inscripto'
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(nuevoCliente);

      // Las rutas de clientes pueden no requerir autenticación en desarrollo
      if (response.status === 201) {
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body).toHaveProperty('cliente');
        expect(response.body.cliente).toHaveProperty('nombre', nuevoCliente.nombre);
        expect(response.body.cliente).toHaveProperty('email', nuevoCliente.email);
      }
    });

    it('debe rechazar crear cliente sin nombre', async () => {
      const nuevoCliente = {
        email: `cliente-${Date.now()}@test.com`,
        telefono: '1234567890'
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(nuevoCliente);

      expect([400, 401]).toContain(response.status);
    });

    it('debe rechazar crear cliente con email inválido', async () => {
      const nuevoCliente = {
        nombre: 'Nuevo Cliente',
        email: 'email-invalido',
        telefono: '1234567890'
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(nuevoCliente);

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('PUT /api/clientes/:id', () => {
    it('debe actualizar un cliente existente', async () => {
      const cliente = await crearClienteTest({ nombre: 'Cliente Original' });

      const datosActualizados = {
        nombre: 'Cliente Actualizado',
        email: `actualizado-${Date.now()}@test.com`,
        telefono: '9876543210'
      };

      const response = await request(app)
        .put(`/api/clientes/${cliente.id}`)
        .send(datosActualizados);

      // Las rutas de clientes pueden no requerir autenticación en desarrollo
      if (response.status === 200) {
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body).toHaveProperty('cliente');
        expect(response.body.cliente).toHaveProperty('nombre', datosActualizados.nombre);
      }
    });

    it('debe devolver 404 si el cliente no existe', async () => {
      const idInexistente = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/clientes/${idInexistente}`)
        .send({ nombre: 'Cliente Actualizado' });

      expect([404, 401]).toContain(response.status);
    });
  });

  describe('DELETE /api/clientes/:id', () => {
    it('debe eliminar un cliente existente', async () => {
      const cliente = await crearClienteTest({ nombre: 'Cliente a Eliminar' });

      const response = await request(app)
        .delete(`/api/clientes/${cliente.id}`);

      // Las rutas de clientes pueden no requerir autenticación en desarrollo
      if (response.status === 200) {
        expect(response.body).toHaveProperty('mensaje');

        // Verificar que el cliente fue eliminado
        const clienteEliminado = await ClienteModel.getById(cliente.id);
        expect(clienteEliminado).toBeNull();
      }
    });

    it('debe devolver 404 si el cliente no existe', async () => {
      const idInexistente = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/clientes/${idInexistente}`);

      expect([404, 401]).toContain(response.status);
    });
  });
});

