# 🎟️ Eventify - Backend de Gestión de Eventos

**Eventify** es un sistema backend completo desarrollado con **Node.js, Express y MongoDB Atlas** para la materia **Desarrollo Web Backend**. El proyecto incluye autenticación, autorización, testing automatizado, y una interfaz web completa con Pug.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Requerimientos de la Tercera Entrega](#-requerimientos-de-la-tercera-entrega)
- [Características Implementadas](#-características-implementadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [API REST](#-api-rest)
- [Vistas Web (Pug)](#-vistas-web-pug)
- [Testing](#-testing)
- [Mejoras Implementadas](#-mejoras-implementadas)

---

## 🧠 Descripción del Proyecto

**Eventify** es un sistema backend para la gestión integral de eventos corporativos. El sistema permite gestionar clientes, empleados, eventos, tareas, cotizaciones, invitados, cronogramas, gastos, facturas y auditoría.

### Objetivos del Proyecto

- Desarrollar una aplicación web usando Node.js y Express
- Integrar con MongoDB Atlas
- Aplicar conceptos de Authentication y Authorization (JWT, Token, Bcrypt, Passport, Sessions)
- Implementar tests automatizados (Jest, Supertest)
- Desarrollar una interfaz web con Pug
- Seguir buenas prácticas de desarrollo
- Documentar el proyecto

---

## ⚙️ Tecnologías Utilizadas

### Backend Core

- **Node.js** v16+ - Entorno de ejecución
- **Express.js** v4.18+ - Framework web
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Mongoose** v8.19+ - ODM para MongoDB

### Autenticación y Autorización

- **Passport.js** v0.7+ - Middleware de autenticación
- **Passport-local** v1.0+ - Estrategia local (email/password)
- **Passport-jwt** v4.0+ - Estrategia JWT
- **jsonwebtoken** v9.0+ - Generación y verificación de tokens JWT
- **bcrypt** v6.0+ - Hash de contraseñas
- **express-session** v1.18+ - Gestión de sesiones
- **connect-mongo** v5.1+ - Almacenamiento de sesiones en MongoDB

### Testing

- **Jest** v30.2+ - Framework de testing
- **Supertest** v7.1+ - Testing de APIs HTTP
- **@jest/globals** v30.2+ - Utilidades de Jest
- **cross-env** v10.1+ - Variables de entorno cross-platform

### Vistas Web

- **Pug** v3.0+ - Motor de plantillas
- **Bootstrap 5** v5.3+ - Framework CSS
- **Bootstrap Icons** v1.10+ - Iconos

### Validación y Utilidades

- **express-validator** v7.3+ - Validación de datos
- **method-override** v3.0+ - Soporte para PUT/DELETE en formularios
- **dotenv** v16.6+ - Variables de entorno
- **nodemailer** v7.0+ - Envío de emails
- **qrcode** v1.5+ - Generación de códigos QR
- **pdfkit** v0.17+ - Generación de PDFs
- **multer** v2.0+ - Manejo de archivos
- **xlsx** v0.18+ - Importación de Excel/CSV

### Desarrollo

- **nodemon** v3.1+ - Auto-restart en desarrollo

---

## 📚 Requerimientos de la Tercera Entrega

### ✅ Requerimientos Cumplidos

1. **Desarrollo de aplicación web con Node.js y Express** ✅

   - Aplicación completa con Express
   - Estructura MVC (Models, Views, Controllers)
   - Rutas organizadas y middleware

2. **Integración con MongoDB Atlas** ✅

   - Conexión a MongoDB Atlas
   - Modelos con Mongoose
   - Validaciones y relaciones

3. **Authentication y Authorization** ✅

   - JWT para API routes
   - Passport.js para vistas web
   - Bcrypt para hash de contraseñas
   - Sessions para autenticación web
   - Control de roles y permisos

4. **Revisión de conceptos previos** ✅

   - Rutas dinámicas
   - Middleware
   - Async/await y Promises
   - Manejo de errores

5. **Buenas prácticas de desarrollo** ✅

   - Código organizado y comentado
   - Separación de responsabilidades
   - Manejo centralizado de errores
   - Validaciones robustas

6. **Tests automatizados y manuales** ✅

   - Tests con Jest y Supertest
   - Tests de integración
   - Tests unitarios
   - Cobertura de código

7. **Documentación** ✅

   - README completo
   - Documentación de APIs
   - Documentación de tests
   - Comentarios en el código

8. **GitHub** ✅
   - Repositorio en GitHub
   - Commits organizados
   - .gitignore configurado

---

## ✨ Características Implementadas

### 🔐 Autenticación y Autorización

#### Autenticación Web (Passport.js + Sesiones)

- Login con email y contraseña
- Sesiones persistentes en MongoDB
- Redirección automática según rol
- Logout con destrucción de sesión
- Protección de rutas web

#### Autenticación API (JWT)

- Login que devuelve token JWT
- Verificación de token en headers
- Tokens con expiración configurable
- Endpoint para verificar token
- Protección de rutas API

#### Seguridad

- Hash de contraseñas con bcrypt (salt rounds: 10)
- Control de intentos fallidos (bloqueo después de 5 intentos)
- Bloqueo temporal (30 minutos)
- Validación de email y contraseña
- Tokens JWT firmados y con expiración
- Cookies HTTP-only para sesiones

#### Roles y Permisos

- **administrador**: Acceso total al sistema
- **productor**: Gestión de eventos y producción
- **financiero**: Gestión financiera y facturación
- **diseñador**: Gestión de diseño y creatividad

### 📊 Gestión de Datos

#### Modelos Principales

- **Cliente**: Gestión de clientes
- **Empleado**: Gestión de empleados
- **Evento**: Gestión de eventos
- **Tarea**: Gestión de tareas
- **Usuario**: Autenticación y autorización

#### Módulos Adicionales (RF1-RF4)

- **Proveedor**: Gestión de proveedores
- **Cotizacion**: Gestión de cotizaciones
- **Invitado**: Gestión de invitados
- **Hito**: Gestión de hitos del cronograma
- **Gasto**: Gestión de gastos
- **FacturaCliente**: Gestión de facturas
- **Auditoria**: Sistema de auditoría

### 🌐 Vistas Web (Pug)

#### Interfaz Web Completa

- Dashboard principal
- Gestión de clientes
- Gestión de empleados
- Gestión de eventos
- Gestión de tareas
- Gestión de proveedores
- Gestión de cotizaciones
- Gestión de invitados
- Gestión de hitos
- Gestión de gastos
- Gestión de facturas
- Sistema de auditoría

#### Características de la Interfaz

- Diseño responsive con Bootstrap 5
- Sidebar de navegación
- Formularios de creación y edición
- Tablas de datos
- Filtros y búsqueda
- Confirmaciones de eliminación
- Notificaciones con toasts

### 🧪 Testing

#### Tests Implementados

- **Tests de Integración**: Pruebas de endpoints API
- **Tests Unitarios**: Pruebas de modelos
- **Helpers**: Funciones auxiliares para tests
- **Setup**: Configuración de base de datos de pruebas

#### Cobertura

- Tests de autenticación
- Tests de clientes
- Tests de eventos
- Tests de gastos
- Tests de modelos

---

## 🧩 Estructura del Proyecto

```
eventify-backend/
│
├── config/                 # Configuraciones
│   ├── constants.js        # Constantes centralizadas
│   └── passport.js         # Configuración de Passport
│
├── controllers/            # Lógica de negocio
│   ├── authController.js
│   ├── clienteController.js
│   ├── ClienteWebController.js
│   ├── empleadoController.js
│   ├── empleadoWebController.js
│   ├── eventoController.js
│   ├── eventoWebController.js
│   ├── tareaController.js
│   ├── tareaWebController.js
│   └── ... (otros controladores)
│
├── models/                # Esquemas de Mongoose
│   ├── ClienteModel.js
│   ├── EmpleadoModel.js
│   ├── EventoModel.js
│   ├── TareaModel.js
│   ├── UsuarioModel.js
│   └── ... (otros modelos)
│
├── routes/                 # Definición de rutas
│   ├── authRoutes.js
│   ├── clienteRoutes.js
│   ├── clienteWebRoutes.js
│   ├── empleadoRoutes.js
│   ├── empleadoWebRoutes.js
│   └── ... (otras rutas)
│
├── middleware/             # Middlewares
│   ├── auth.js            # Autenticación y autorización
│   ├── errorHandler.js    # Manejo de errores
│   ├── validations.js     # Validaciones
│   └── auditoria.js       # Auditoría
│
├── views/                  # Plantillas Pug
│   ├── auth/
│   │   └── login.pug
│   ├── layout/
│   │   └── layout.pug
│   ├── clientes/
│   ├── empleados/
│   ├── eventos/
│   ├── tareas/
│   └── ... (otras vistas)
│
├── tests/                  # Tests
│   ├── helpers/
│   │   └── testHelpers.js
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── clientes.test.js
│   │   └── ... (otros tests)
│   ├── unit/
│   │   └── models/
│   │       └── cliente.test.js
│   └── setup.js
│
├── utils/                  # Utilidades
│   ├── emailService.js
│   ├── pdfGenerator.js
│   ├── qrGenerator.js
│   └── excelImporter.js
│
├── publics/                # Archivos estáticos
│   └── css/
│       └── styles.css
│
├── db/                     # Configuración de BD
│   └── mongoose.js
│
├── app.js                  # Configuración principal
├── server.js               # Servidor de producción
├── jest.config.js         # Configuración de Jest
├── package.json
├── .env                    # Variables de entorno
└── README.md
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js v16 o superior
- MongoDB Atlas o MongoDB local
- Git

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/micakn/eventify-backend.git
cd eventify-backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/eventify

# Autenticación
JWT_SECRET=tu-secret-key-muy-segura-cambiar-en-produccion
JWT_EXPIRES_IN=24h
SESSION_SECRET=tu-session-secret-cambiar-en-produccion

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password-de-aplicacion
EMAIL_FROM=noreply@eventify.com
```

4. **Cargar datos iniciales** (opcional)

```bash
node seed.js
```

5. **Crear usuario administrador**

```bash
node scripts/createAdmin.js
```

6. **Iniciar el servidor**

```bash
# Producción
npm start

# Desarrollo (con auto-restart)
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## 🔐 Autenticación y Autorización

### Autenticación Web (Passport.js)

#### Login

```bash
POST /auth/login
Body: { email, password }
```

#### Logout

```bash
GET /auth/logout
```

### Autenticación API (JWT)

#### Login

```bash
POST /auth/api/login
Body: { email, password }
Response: { token, usuario, expiresIn }
```

#### Usar token

```bash
GET /api/clientes
Headers: { Authorization: "Bearer <token>" }
```

#### Verificar token

```bash
GET /auth/api/verify
Headers: { Authorization: "Bearer <token>" }
```

### Middleware de Autenticación

#### Para Vistas Web

```javascript
import { requireAuth } from "./middleware/auth.js";
app.use("/clientes", requireAuth, clienteWebRoutes);
```

#### Para API

```javascript
import { authenticateJWT } from "./middleware/auth.js";
app.use("/api/clientes", authenticateJWT, clienteRoutes);
```

### Middleware de Autorización

#### Por Rol

```javascript
import { requireRole } from "./middleware/auth.js";
app.use(
  "/auditoria",
  requireAuth,
  requireRole("administrador", "financiero"),
  auditoriaRoutes
);
```

---

## 📡 API REST

### Endpoints Principales

#### Autenticación

- `POST /auth/api/login` - Login API (JWT)
- `POST /auth/login` - Login Web (Sesión)
- `GET /auth/logout` - Logout Web
- `POST /auth/api/logout` - Logout API
- `GET /auth/api/verify` - Verificar token

#### Clientes

- `GET /api/clientes` - Listar todos
- `GET /api/clientes/:id` - Obtener uno
- `POST /api/clientes` - Crear nuevo
- `PUT /api/clientes/:id` - Actualizar completo
- `PATCH /api/clientes/:id` - Actualizar parcial
- `DELETE /api/clientes/:id` - Eliminar

#### Empleados

- `GET /api/empleados` - Listar todos
- `GET /api/empleados/:id` - Obtener uno
- `POST /api/empleados` - Crear nuevo
- `PUT /api/empleados/:id` - Actualizar
- `DELETE /api/empleados/:id` - Eliminar

#### Eventos

- `GET /api/eventos` - Listar (con filtros)
- `GET /api/eventos/:id` - Obtener uno
- `POST /api/eventos` - Crear nuevo
- `PUT /api/eventos/:id` - Actualizar
- `DELETE /api/eventos/:id` - Eliminar

#### Tareas

- `GET /api/tareas` - Listar (con filtros)
- `GET /api/tareas/:id` - Obtener una
- `POST /api/tareas` - Crear (con validación)
- `PATCH /api/tareas/:id` - Actualizar
- `DELETE /api/tareas/:id` - Eliminar

### Ejemplo de Uso

#### Crear Cliente

```bash
POST /api/clientes
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Empresa XYZ",
  "email": "contacto@xyz.com",
  "telefono": "+5491122334455",
  "empresa": "XYZ S.A."
}
```

#### Respuesta

```json
{
  "mensaje": "Cliente creado exitosamente",
  "data": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "nombre": "Empresa XYZ",
    "email": "contacto@xyz.com",
    "telefono": "+5491122334455",
    "empresa": "XYZ S.A."
  }
}
```

---

## 🌐 Vistas Web (Pug)

### Rutas Web Disponibles

- `/` - Dashboard principal
- `/clientes` - Lista de clientes
- `/clientes/nuevo` - Formulario de nuevo cliente
- `/clientes/editar/:id` - Editar cliente
- `/clientes/:id` - Detalle del cliente
- `/empleados` - Lista de empleados
- `/eventos` - Lista de eventos
- `/tareas` - Lista de tareas
- `/proveedores` - Lista de proveedores
- `/cotizaciones` - Lista de cotizaciones
- `/invitados` - Lista de invitados
- `/hitos` - Lista de hitos
- `/gastos` - Lista de gastos
- `/facturas` - Lista de facturas
- `/auditoria` - Registros de auditoría (solo admin/financiero)

### Características de la Interfaz

- **Diseño Responsive**: Bootstrap 5 para dispositivos móviles
- **Sidebar de Navegación**: Navegación fácil entre módulos
- **Formularios**: Creación y edición de datos
- **Tablas**: Visualización de datos en tablas
- **Filtros**: Filtrado por estado, cliente, evento, etc.
- **Confirmaciones**: Confirmación antes de eliminar
- **Notificaciones**: Toasts de Bootstrap para feedback

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Estructura de Tests

#### Tests de Integración

- `tests/integration/auth.test.js` - Autenticación
- `tests/integration/clientes.test.js` - Clientes
- `tests/integration/eventos.test.js` - Eventos
- `tests/integration/gastos.test.js` - Gastos

#### Tests Unitarios

- `tests/unit/models/cliente.test.js` - Modelo Cliente

#### Helpers

- `tests/helpers/testHelpers.js` - Funciones auxiliares

### Configuración de Tests

- Base de datos de pruebas: `mongodb://localhost:27017/eventify-test`
- Limpieza automática después de cada test
- Variables de entorno: `NODE_ENV=test`

### Ejemplo de Test

```javascript
import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";

describe("GET /api/clientes", () => {
  it("debería devolver lista de clientes", async () => {
    const response = await request(app).get("/api/clientes").expect(200);

    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

---

## 🔧 Mejoras Implementadas

### 1. Autenticación y Autorización

- ✅ Sistema de autenticación dual (JWT + Passport)
- ✅ Control de roles y permisos
- ✅ Hash de contraseñas con bcrypt
- ✅ Bloqueo por intentos fallidos
- ✅ Sesiones persistentes en MongoDB

### 2. Testing

- ✅ Tests automatizados con Jest y Supertest
- ✅ Tests de integración
- ✅ Tests unitarios
- ✅ Cobertura de código
- ✅ Helpers reutilizables

### 3. Validaciones

- ✅ Validación de datos con express-validator
- ✅ Validación de ObjectId
- ✅ Validación de enums
- ✅ Validación de fechas
- ✅ Mensajes de error descriptivos

### 4. Manejo de Errores

- ✅ Manejo centralizado de errores
- ✅ Middleware de error handling
- ✅ Respuestas de error consistentes
- ✅ Logging de errores

### 5. Organización del Código

- ✅ Estructura MVC clara
- ✅ Separación de responsabilidades
- ✅ Constantes centralizadas
- ✅ Código comentado
- ✅ Middleware reutilizable

### 6. Interfaz Web

- ✅ Vistas Pug completas
- ✅ Diseño responsive
- ✅ Navegación intuitiva
- ✅ Formularios funcionales
- ✅ Feedback visual

---

## 📝 Scripts Disponibles

```bash
# Producción
npm start

# Desarrollo (con auto-restart)
npm run dev

# Testing
npm test
npm run test:watch
npm run test:coverage

# Cargar datos iniciales
node seed.js

# Crear usuario administrador
node scripts/createAdmin.js
```

---

## 📚 Documentación Adicional

### Documentos Principales

- `README.md` - Documentación general del proyecto
- `README_BACKEND.md` - Documentación específica para Backend (este archivo)
- `DOCUMENTO_INGENIERIA_SOFTWARE.md` - Documento completo para Ingeniería de Software

### Documentación de Implementación

Ver carpeta `docs/implementacion/`:

- `IMPLEMENTACION_FASE1_AUTENTICACION.md` - Sistema de autenticación (JWT y Passport.js)
- `IMPLEMENTACION_FASE2_COTIZACIONES.md` - RF1: Cotizaciones y proveedores
- `IMPLEMENTACION_FASE2_INVITADOS.md` - RF2: Invitados y acreditación
- `IMPLEMENTACION_FASE3_CRONOGRAMA.md` - RF3: Cronograma y responsables
- `IMPLEMENTACION_FASE4_FACTURACION.md` - RF4: Facturación y cierre contable
- `IMPLEMENTACION_AUDITORIA.md` - Sistema de auditoría (RNF4)
- `IMPLEMENTACION_TESTING.md` - Sistema de testing (Jest y Supertest)

### Documentación de Planificación

Ver carpeta `docs/planificacion/`:

- `ANALISIS_REQUERIMIENTOS_PDF.md` - Análisis de requerimientos del PDF
- `PLAN_IMPLEMENTACION_COMPLETO.md` - Plan completo de implementación
- `MEJORAS_IMPLEMENTADAS.md` - Mejoras generales implementadas
- `RESUMEN_IMPLEMENTACION_COMPLETA.md` - Resumen ejecutivo de la implementación

---

## 🎯 Estado del Proyecto

### ✅ Completado

- [x] Autenticación (JWT y Passport.js)
- [x] Autorización (roles y permisos)
- [x] Testing (Jest y Supertest)
- [x] Interfaz Web (Pug)
- [x] Validaciones robustas
- [x] Manejo de errores
- [x] Documentación completa

### ⏳ Mejoras Futuras

- [ ] Ampliar cobertura de tests
- [ ] Optimización de consultas
- [ ] Caché de consultas frecuentes
- [ ] Logging estructurado
- [ ] Métricas de rendimiento

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 🔗 Enlaces

- **Repositorio**: [eventify-backend](https://github.com/micakn/eventify-backend)
- **Documentación**: Ver carpeta `docs/` para documentación detallada

---

**🎉 ¡Gracias por usar Eventify!**
