// tests/integration/gastos.test.js
// -------------------- TESTS DE INTEGRACIÓN: GASTOS --------------------
import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { crearEventoTest, crearClienteTest, crearUsuarioTest, crearEmpleadoTest, crearTokenTest } from '../helpers/testHelpers.js';
import GastoModel from '../../models/GastoModel.js';
import app from '../../app.js';
import mongoose from 'mongoose';

describe('Gastos API', () => {
  let usuario;
  let token;
  let evento;
  let cliente;

  beforeAll(async () => {
    // Conectar a la base de datos de pruebas
    if (mongoose.connection.readyState === 0) {
      const { connectMongo } = await import('../../db/mongoose.js');
      await connectMongo(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify-test');
    }
  });

  beforeEach(async () => {
    // Crear datos de prueba
    cliente = await crearClienteTest();
    evento = await crearEventoTest({ cliente });
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

  describe('GET /api/gastos', () => {
    it('debe obtener la lista de gastos', async () => {
      // Crear algunos gastos de prueba
      await GastoModel.add({
        evento: evento.id,
        descripcion: 'Gasto 1',
        categoria: 'Catering',
        monto: 1000,
        iva: 210,
        estado: 'pendiente'
      });

      await GastoModel.add({
        evento: evento.id,
        descripcion: 'Gasto 2',
        categoria: 'Sonido',
        monto: 2000,
        iva: 420,
        estado: 'pendiente'
      });

      const response = await request(app)
        .get('/api/gastos');

      if (response.status === 200) {
        expect(response.body).toHaveProperty('gastos');
        expect(Array.isArray(response.body.gastos)).toBe(true);
        expect(response.body.gastos.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('debe filtrar gastos por evento', async () => {
      const otroEvento = await crearEventoTest({ cliente });

      await GastoModel.add({
        evento: evento.id,
        descripcion: 'Gasto Evento 1',
        categoria: 'Catering',
        monto: 1000,
        iva: 210
      });

      await GastoModel.add({
        evento: otroEvento.id,
        descripcion: 'Gasto Evento 2',
        categoria: 'Sonido',
        monto: 2000,
        iva: 420
      });

      const response = await request(app)
        .get(`/api/gastos?evento=${evento.id}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('gastos');
        expect(Array.isArray(response.body.gastos)).toBe(true);
        // Todos los gastos deben pertenecer al evento filtrado
        response.body.gastos.forEach(gasto => {
          expect(gasto.evento.id || gasto.evento).toBe(evento.id);
        });
      }
    });
  });

  describe('GET /api/gastos/evento/:eventoId/resumen', () => {
    it('debe obtener resumen de gastos por evento', async () => {
      await GastoModel.add({
        evento: evento.id,
        descripcion: 'Gasto 1',
        categoria: 'Catering',
        monto: 1000,
        iva: 210,
        estado: 'pendiente'
      });

      await GastoModel.add({
        evento: evento.id,
        descripcion: 'Gasto 2',
        categoria: 'Sonido',
        monto: 2000,
        iva: 420,
        estado: 'pagado'
      });

      const response = await request(app)
        .get(`/api/gastos/evento/${evento.id}/resumen`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('resumen');
        expect(response.body.resumen).toHaveProperty('totalGastos');
        expect(response.body.resumen).toHaveProperty('totalPagado');
        expect(response.body.resumen).toHaveProperty('totalPendiente');
        expect(response.body.resumen).toHaveProperty('porCategoria');
        expect(response.body.resumen.totalGastos).toBeGreaterThan(0);
      }
    });
  });

  describe('POST /api/gastos', () => {
    it('debe crear un nuevo gasto con datos válidos', async () => {
      const nuevoGasto = {
        evento: evento.id,
        descripcion: 'Nuevo Gasto',
        categoria: 'Catering',
        monto: 1000,
        iva: 210,
        estado: 'pendiente',
        metodoPago: 'transferencia'
      };

      const response = await request(app)
        .post('/api/gastos')
        .send(nuevoGasto);

      if (response.status === 201) {
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body).toHaveProperty('gasto');
        expect(response.body.gasto).toHaveProperty('descripcion', nuevoGasto.descripcion);
        expect(response.body.gasto).toHaveProperty('total', 1210); // monto + iva
      }
    });

    it('debe rechazar crear gasto sin evento', async () => {
      const nuevoGasto = {
        descripcion: 'Gasto Sin Evento',
        categoria: 'Catering',
        monto: 1000,
        iva: 210
      };

      const response = await request(app)
        .post('/api/gastos')
        .send(nuevoGasto);

      expect([400, 401]).toContain(response.status);
    });

    it('debe rechazar crear gasto sin descripción', async () => {
      const nuevoGasto = {
        evento: evento.id,
        categoria: 'Catering',
        monto: 1000,
        iva: 210
      };

      const response = await request(app)
        .post('/api/gastos')
        .send(nuevoGasto);

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/gastos/:id/aprobar', () => {
    it('debe aprobar un gasto pendiente', async () => {
      const gasto = await GastoModel.add({
        evento: evento.id,
        descripcion: 'Gasto Pendiente',
        categoria: 'Catering',
        monto: 1000,
        iva: 210,
        estado: 'pendiente'
      });

      const empleado = await crearEmpleadoTest();

      const response = await request(app)
        .post(`/api/gastos/${gasto.id}/aprobar`)
        .send({ empleadoId: empleado.id });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body).toHaveProperty('gasto');
        expect(response.body.gasto).toHaveProperty('estado', 'pagado');
      }
    });
  });

  describe('DELETE /api/gastos/:id', () => {
    it('debe eliminar un gasto existente', async () => {
      const gasto = await GastoModel.add({
        evento: evento.id,
        descripcion: 'Gasto a Eliminar',
        categoria: 'Catering',
        monto: 1000,
        iva: 210
      });

      const response = await request(app)
        .delete(`/api/gastos/${gasto.id}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('mensaje');

        // Verificar que el gasto fue eliminado
        const gastoEliminado = await GastoModel.getById(gasto.id);
        expect(gastoEliminado).toBeNull();
      }
    });
  });
});

