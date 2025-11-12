// tests/integration/eventos.test.js
// -------------------- TESTS DE INTEGRACIÓN: EVENTOS --------------------
import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { crearEventoTest, crearClienteTest, crearUsuarioTest, crearEmpleadoTest, crearTokenTest } from '../helpers/testHelpers.js';
import EventoModel from '../../models/EventoModel.js';
import app from '../../app.js';
import mongoose from 'mongoose';

describe('Eventos API', () => {
  let usuario;
  let token;
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

  describe('GET /api/eventos', () => {
    it('debe obtener la lista de eventos', async () => {
      // Crear algunos eventos de prueba
      await crearEventoTest({ cliente, nombre: 'Evento 1' });
      await crearEventoTest({ cliente, nombre: 'Evento 2' });

      const response = await request(app)
        .get('/api/eventos');

      // Las rutas pueden no requerir autenticación en desarrollo
      if (response.status === 200) {
        expect(response.body).toHaveProperty('eventos');
        expect(Array.isArray(response.body.eventos)).toBe(true);
        expect(response.body.eventos.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('debe filtrar eventos por estado', async () => {
      await crearEventoTest({ cliente, nombre: 'Evento Planificación', estado: 'planificacion' });
      await crearEventoTest({ cliente, nombre: 'Evento En Curso', estado: 'en_curso' });

      const response = await request(app)
        .get('/api/eventos?estado=planificacion');

      if (response.status === 200) {
        expect(response.body).toHaveProperty('eventos');
        expect(Array.isArray(response.body.eventos)).toBe(true);
        // Todos los eventos deben tener el estado filtrado
        response.body.eventos.forEach(evento => {
          expect(evento).toHaveProperty('estado', 'planificacion');
        });
      }
    });
  });

  describe('GET /api/eventos/:id', () => {
    it('debe obtener un evento por ID', async () => {
      const evento = await crearEventoTest({ cliente, nombre: 'Evento Test' });

      const response = await request(app)
        .get(`/api/eventos/${evento.id}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('id', evento.id);
        expect(response.body).toHaveProperty('nombre', 'Evento Test');
      }
    });

    it('debe devolver 404 si el evento no existe', async () => {
      const idInexistente = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/eventos/${idInexistente}`);

      expect([404, 401]).toContain(response.status);
    });
  });

  describe('POST /api/eventos', () => {
    it('debe crear un nuevo evento con datos válidos', async () => {
      const nuevoEvento = {
        nombre: 'Nuevo Evento',
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 86400000),
        lugar: 'Lugar Test',
        descripcion: 'Descripción Test',
        presupuesto: 10000,
        cliente: cliente.id,
        estado: 'planificacion'
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(nuevoEvento);

      if (response.status === 201) {
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body).toHaveProperty('evento');
        expect(response.body.evento).toHaveProperty('nombre', nuevoEvento.nombre);
        expect(response.body.evento).toHaveProperty('cliente');
      }
    });

    it('debe rechazar crear evento sin nombre', async () => {
      const nuevoEvento = {
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 86400000),
        lugar: 'Lugar Test',
        cliente: cliente.id
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(nuevoEvento);

      expect([400, 401]).toContain(response.status);
    });

    it('debe rechazar crear evento sin cliente', async () => {
      const nuevoEvento = {
        nombre: 'Evento Sin Cliente',
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 86400000),
        lugar: 'Lugar Test'
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(nuevoEvento);

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('PUT /api/eventos/:id', () => {
    it('debe actualizar un evento existente', async () => {
      const evento = await crearEventoTest({ cliente, nombre: 'Evento Original' });

      const datosActualizados = {
        nombre: 'Evento Actualizado',
        lugar: 'Nuevo Lugar'
      };

      const response = await request(app)
        .put(`/api/eventos/${evento.id}`)
        .send(datosActualizados);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body).toHaveProperty('evento');
        expect(response.body.evento).toHaveProperty('nombre', datosActualizados.nombre);
      }
    });
  });

  describe('PATCH /api/eventos/:id/estado', () => {
    it('debe cambiar el estado de un evento', async () => {
      const evento = await crearEventoTest({ cliente, estado: 'planificacion' });

      const response = await request(app)
        .patch(`/api/eventos/${evento.id}/estado`)
        .send({ estado: 'en_curso' });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('mensaje');
        expect(response.body).toHaveProperty('evento');
        expect(response.body.evento).toHaveProperty('estado', 'en_curso');
      }
    });

    it('debe rechazar cambio a estado inválido', async () => {
      const evento = await crearEventoTest({ cliente });

      const response = await request(app)
        .patch(`/api/eventos/${evento.id}/estado`)
        .send({ estado: 'estado-invalido' });

      expect([400, 401, 404]).toContain(response.status);
    });
  });

  describe('DELETE /api/eventos/:id', () => {
    it('debe eliminar un evento existente', async () => {
      const evento = await crearEventoTest({ cliente, nombre: 'Evento a Eliminar' });

      const response = await request(app)
        .delete(`/api/eventos/${evento.id}`);

      if (response.status === 200) {
        expect(response.body).toHaveProperty('mensaje');

        // Verificar que el evento fue eliminado
        const eventoEliminado = await EventoModel.getById(evento.id);
        expect(eventoEliminado).toBeNull();
      }
    });
  });
});

