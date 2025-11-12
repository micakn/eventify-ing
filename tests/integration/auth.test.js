// tests/integration/auth.test.js
// -------------------- TESTS DE INTEGRACIÓN: AUTENTICACIÓN --------------------
import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { crearUsuarioTest, crearEmpleadoTest, crearTokenTest } from '../helpers/testHelpers.js';
import UsuarioModel from '../../models/UsuarioModel.js';
import app from '../../app.js';
import mongoose from 'mongoose';

describe('Autenticación API', () => {
  let usuario;
  let empleado;
  let token;

  beforeAll(async () => {
    // Conectar a la base de datos de pruebas
    if (mongoose.connection.readyState === 0) {
      const { connectMongo } = await import('../../db/mongoose.js');
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify-test';
      await connectMongo(mongoUri);
    }
  });

  beforeEach(async () => {
    // Crear datos de prueba antes de cada test
    empleado = await crearEmpleadoTest({
      email: `empleado-${Date.now()}@test.com`
    });
    usuario = await crearUsuarioTest({ 
      empleado: empleado,
      email: `test-${Date.now()}@test.com`,
      password: 'password123'
    });
    token = await crearTokenTest(usuario);
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada test
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    } catch (error) {
      console.error('Error al limpiar la base de datos:', error);
    }
  });

  describe('POST /auth/api/login', () => {
    it('debe hacer login exitoso con credenciales válidas', async () => {
      const response = await request(app)
        .post('/auth/api/login')
        .send({
          email: usuario.email,
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('usuario');
      expect(response.body).toHaveProperty('mensaje', 'Login exitoso');
      expect(response.body.usuario).toHaveProperty('email', usuario.email);
    });

    it('debe rechazar login con credenciales inválidas', async () => {
      const response = await request(app)
        .post('/auth/api/login')
        .send({
          email: usuario.email,
          password: 'passwordincorrecta'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('mensaje');
    });

    it('debe rechazar login sin email', async () => {
      const response = await request(app)
        .post('/auth/api/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    it('debe rechazar login sin contraseña', async () => {
      const response = await request(app)
        .post('/auth/api/login')
        .send({
          email: usuario.email
        });

      expect(response.status).toBe(400);
    });

    it('debe rechazar login con email inexistente', async () => {
      const response = await request(app)
        .post('/auth/api/login')
        .send({
          email: 'noexiste@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/api/register', () => {
    it('debe requerir autenticación de administrador', async () => {
      const nuevoEmpleado = await crearEmpleadoTest({
        email: `empleado-${Date.now()}@test.com`
      });

      const response = await request(app)
        .post('/auth/api/register')
        .send({
          email: `nuevo-${Date.now()}@test.com`,
          password: 'password123',
          rol: 'planner',
          empleadoId: nuevoEmpleado.id
        });

      // Debe requerir autenticación
      expect([401, 403]).toContain(response.status);
    });

    it('debe crear usuario con token de administrador', async () => {
      // Crear usuario administrador
      const adminEmpleado = await crearEmpleadoTest({
        email: `admin-${Date.now()}@test.com`,
        rol: 'administrador'
      });
      const adminUsuario = await crearUsuarioTest({
        empleado: adminEmpleado,
        email: `admin-${Date.now()}@test.com`,
        password: 'password123',
        rol: 'administrador'
      });
      const adminToken = await crearTokenTest(adminUsuario);

      const nuevoEmpleado = await crearEmpleadoTest({
        email: `empleado-${Date.now()}@test.com`
      });

      const response = await request(app)
        .post('/auth/api/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: `nuevo-${Date.now()}@test.com`,
          password: 'password123',
          rol: 'planner',
          empleadoId: nuevoEmpleado.id
        });

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('GET /auth/api/verify', () => {
    it('debe verificar un token válido', async () => {
      const response = await request(app)
        .get('/auth/api/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).toHaveProperty('email', usuario.email);
    });

    it('debe rechazar un token inválido', async () => {
      const response = await request(app)
        .get('/auth/api/verify')
        .set('Authorization', 'Bearer token-invalido');

      expect(response.status).toBe(401);
    });

    it('debe rechazar petición sin token', async () => {
      const response = await request(app)
        .get('/auth/api/verify');

      expect(response.status).toBe(401);
    });

    it('debe rechazar token mal formado', async () => {
      const response = await request(app)
        .get('/auth/api/verify')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid');

      expect(response.status).toBe(401);
    });
  });
});
