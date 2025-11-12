# 🔐 Fase 1: Implementación de Autenticación - COMPLETADA

## ✅ Resumen de Implementación

Se ha implementado un sistema completo de autenticación y autorización que cumple con los requisitos del parcial de Backend y los requerimientos del PDF de Ingeniería de Software.

---

## 📦 Archivos Creados/Modificados

### **Nuevos Archivos:**

1. **`models/UsuarioModel.js`**
   - Modelo de Usuario con hash de contraseñas (bcrypt)
   - Métodos para comparar contraseñas
   - Control de intentos fallidos y bloqueo
   - Sistema de recuperación de contraseña
   - Relación con modelo Empleado

2. **`config/passport.js`**
   - Configuración de Passport.js
   - Estrategia Local (para sesiones web)
   - Estrategia JWT (para API)
   - Serialización/Deserialización de usuarios

3. **`middleware/auth.js`**
   - `authenticateSession`: Autenticación para vistas web
   - `authenticateJWT`: Autenticación JWT para API
   - `requireAuth`: Verificar sesión activa (vistas)
   - `requireRole`: Autorización por roles
   - `generateToken`: Generar tokens JWT
   - `verifyToken`: Verificar tokens JWT

4. **`controllers/authController.js`**
   - `loginWeb`: Login para vistas (sesiones)
   - `loginAPI`: Login para API (JWT)
   - `logoutWeb`: Logout para vistas
   - `logoutAPI`: Logout para API
   - `register`: Registro de usuarios
   - `verifyToken`: Verificar token JWT
   - `requestPasswordRecovery`: Solicitar recuperación
   - `resetPassword`: Resetear contraseña

5. **`routes/authRoutes.js`**
   - Rutas de autenticación con validaciones
   - Separación entre rutas web y API

6. **`views/auth/login.pug`**
   - Vista de login con Bootstrap

### **Archivos Modificados:**

1. **`app.js`**
   - Configuración de sesiones con MongoDB
   - Inicialización de Passport
   - Protección de rutas web con `requireAuth`
   - Rutas de autenticación
   - Middleware para pasar usuario a vistas

2. **`views/layout/layout.pug`**
   - Mostrar información del usuario autenticado
   - Botón de logout

---

## 🔑 Características Implementadas

### **1. Autenticación Dual**

#### **Para Vistas Web (Passport.js + Sesiones)**
- ✅ Login con email y contraseña
- ✅ Sesiones persistentes en MongoDB
- ✅ Redirección automática según rol
- ✅ Logout con destrucción de sesión
- ✅ Protección de rutas web

#### **Para API (JWT)**
- ✅ Login que devuelve token JWT
- ✅ Verificación de token en headers
- ✅ Tokens con expiración configurable
- ✅ Endpoint para verificar token

### **2. Seguridad**

- ✅ Hash de contraseñas con bcrypt (salt rounds: 10)
- ✅ Control de intentos fallidos (bloqueo después de 5 intentos)
- ✅ Bloqueo temporal (30 minutos)
- ✅ Validación de email y contraseña
- ✅ Tokens JWT firmados y con expiración
- ✅ Cookies HTTP-only para sesiones
- ✅ Sesiones seguras en producción (HTTPS)

### **3. Roles y Permisos**

- ✅ 4 roles: `administrador`, `productor`, `financiero`, `diseñador`
- ✅ Middleware `requireRole` para autorización
- ✅ Redirección según rol después del login
- ✅ Protección de endpoints por rol

### **4. Recuperación de Contraseña**

- ✅ Generación de tokens de recuperación
- ✅ Tokens con expiración (1 hora)
- ✅ Endpoint para solicitar recuperación
- ✅ Endpoint para resetear contraseña
- ⚠️ **Pendiente**: Envío de emails (estructura lista)

---

## 📋 Endpoints Implementados

### **Rutas Web (Sesiones)**
- `GET /login` - Vista de login
- `POST /auth/login` - Procesar login
- `POST /auth/logout` - Cerrar sesión

### **Rutas API (JWT)**
- `POST /auth/api/login` - Login y obtener token
- `POST /auth/api/logout` - Logout (invalidar token)
- `POST /auth/api/register` - Registrar usuario (solo admin)
- `GET /auth/api/verify` - Verificar token
- `POST /auth/api/recovery` - Solicitar recuperación
- `POST /auth/api/reset-password` - Resetear contraseña

---

## 🔧 Configuración Necesaria

### **Variables de Entorno (.env)**

```env
# Autenticación
JWT_SECRET=tu-secret-key-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=24h
SESSION_SECRET=tu-session-secret-cambiar-en-produccion

# MongoDB (ya existente)
MONGODB_URI=mongodb+srv://...
```

---

## 📝 Uso de la API

### **Ejemplo: Login API**

```bash
POST /auth/api/login
Content-Type: application/json

{
  "email": "usuario@eventify.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "...",
    "email": "usuario@eventify.com",
    "rol": "productor",
    "empleado": { ... }
  },
  "expiresIn": "24h"
}
```

### **Ejemplo: Usar Token en API**

```bash
GET /api/clientes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ Notas Importantes

1. **APIs sin Protección (Desarrollo)**
   - Por ahora, las APIs están sin protección JWT para facilitar pruebas
   - En producción, descomentar las líneas en `app.js` para proteger las APIs

2. **Envío de Emails**
   - La estructura de recuperación de contraseña está lista
   - Falta implementar el envío real de emails (nodemailer)
   - Por ahora, el token se devuelve en la respuesta (solo para desarrollo)

3. **Primer Usuario**
   - Necesitas crear el primer usuario manualmente o mediante script
   - Se puede hacer desde la API: `POST /auth/api/register` (requiere ser admin, pero puedes crear el primer admin directamente en la BD)

---

## ✅ Checklist de Implementación

- [x] Modelo Usuario con bcrypt
- [x] Passport.js configurado (Local + JWT)
- [x] Sesiones en MongoDB
- [x] Login web (sesiones)
- [x] Login API (JWT)
- [x] Logout web y API
- [x] Registro de usuarios
- [x] Control de intentos fallidos
- [x] Bloqueo de usuarios
- [x] Recuperación de contraseña (estructura)
- [x] Middleware de autorización por roles
- [x] Protección de rutas web
- [x] Vista de login
- [x] Integración en layout

---

## 🚀 Próximos Pasos

1. **Crear script de seed para usuarios iniciales**
2. **Implementar envío de emails** (nodemailer)
3. **Agregar tests** (Jest + Supertest)
4. **Implementar módulos del PDF** (Cotizaciones, Invitados, Facturación)

---

**Fecha de implementación:** 2025
**Estado:** ✅ Completado - Listo para pruebas

