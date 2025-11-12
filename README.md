# 🎟️ Eventify - Backend de Gestión de Eventos

**Eventify** es un sistema backend completo desarrollado con **Node.js, Express y MongoDB Atlas**, diseñado para gestionar eventos corporativos, incluyendo cotizaciones, invitados, cronogramas, facturación y auditoría.

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Características Principales](#-características-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelos de Datos](#-modelos-de-datos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Testing](#-testing)
- [Documentación Adicional](#-documentación-adicional)

---

## 🧠 Descripción General

El sistema permite:

- ✅ **Gestión de Clientes, Empleados y Eventos**
- ✅ **Sistema de Autenticación** (JWT para API, Passport.js para web)
- ✅ **RF1: Cotizaciones y Proveedores** (con versionado y PDF)
- ✅ **RF2: Invitados y Acreditación** (con QR, emails masivos, importación Excel)
- ✅ **RF3: Cronograma y Responsables** (hitos, tareas, asignación de responsables)
- ✅ **RF4: Facturación y Cierre Contable** (gastos, facturas, reportes de rentabilidad)
- ✅ **Sistema de Auditoría** (registro inmutable de todas las acciones)
- ✅ **Testing Automatizado** (Jest y Supertest)
- ✅ **Validaciones robustas** y manejo centralizado de errores

---

## ⚙️ Tecnologías Utilizadas

| Tecnología            | Descripción                           |
| --------------------- | ------------------------------------- |
| **Node.js**           | Entorno de ejecución para JavaScript  |
| **Express**           | Framework web minimalista             |
| **MongoDB Atlas**     | Base de datos NoSQL en la nube        |
| **Mongoose**          | ODM para MongoDB                      |
| **Pug**               | Motor de plantillas para vistas       |
| **Passport.js**       | Autenticación (Local y JWT)           |
| **JWT**               | Tokens para autenticación API         |
| **Bcrypt**            | Hash de contraseñas                   |
| **Express-session**   | Gestión de sesiones                   |
| **Connect-mongo**     | Almacenamiento de sesiones en MongoDB |
| **Express-validator** | Validación de datos                   |
| **PDFKit**            | Generación de PDFs                    |
| **Nodemailer**        | Envío de emails                       |
| **QRCode**            | Generación de códigos QR              |
| **Multer**            | Manejo de archivos                    |
| **XLSX**              | Importación de Excel/CSV              |
| **Jest**              | Framework de testing                  |
| **Supertest**         | Testing de APIs                       |
| **Bootstrap 5**       | Framework CSS para diseño responsivo  |
| **Dotenv**            | Gestión de variables de entorno       |
| **Nodemon**           | Reinicio automático en desarrollo     |

---

## ✨ Características Principales

### 🔐 Autenticación y Autorización

- **Autenticación Web**: Passport.js con sesiones para vistas Pug
- **Autenticación API**: JWT (JSON Web Tokens) para endpoints REST
- **Roles y Permisos**: Administrador, Productor, Financiero, Diseñador
- **Recuperación de Contraseña**: Sistema de tokens de recuperación
- **Bloqueo de Cuentas**: Protección contra ataques de fuerza bruta

### 📄 RF1: Cotizaciones y Proveedores

- Gestión completa de proveedores
- Creación y seguimiento de cotizaciones
- Versionado de cotizaciones (historial)
- Cálculo automático de márgenes de ganancia
- Generación de PDFs con formato institucional
- Estados: borrador, pendiente, aprobada, rechazada, vencida

### 👥 RF2: Invitados y Acreditación

- Gestión de invitados por evento
- Envío masivo de invitaciones por email
- Generación de códigos QR para acreditación
- Importación de listas desde Excel/CSV
- RSVP público (confirmación/declinación de asistencia)
- Check-in de invitados

### 📅 RF3: Cronograma y Responsables

- Gestión de hitos (milestones) por evento
- Asignación de múltiples responsables a eventos
- Estados de eventos: planificación, en_curso, ejecutado, cerrado, cancelado
- Tipos de hitos: reunión, tarea, hito, revisión, entrega
- Dependencias entre hitos
- Vista combinada de cronograma (hitos + tareas)

### 💰 RF4: Facturación y Cierre Contable

- Registro de gastos reales por evento
- Conciliación automática presupuesto vs gastos
- Alertas de desvío de presupuesto
- Generación automática de facturas desde gastos o cotizaciones
- Cálculo automático de IVA y totales
- Reportes de rentabilidad (varianza por categoría)
- Sistema de aprobación de gastos y facturas
- Estados de factura: borrador, pendiente, enviada, pagada, cancelada

### 📊 Sistema de Auditoría (RNF4)

- Registro inmutable de todas las acciones del sistema
- Trazabilidad completa de operaciones financieras
- Registro de login/logout
- Filtrado y búsqueda de registros
- Resumen estadístico de acciones
- Prevención de modificaciones en facturas/gastos cerrados

### 🧪 Testing

- Tests de integración con Supertest
- Tests unitarios de modelos
- Cobertura de código configurada
- Helpers reutilizables para datos de prueba
- Limpieza automática de base de datos

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
│   ├── auditoriaController.js
│   ├── clienteController.js
│   ├── cotizacionController.js
│   ├── empleadoController.js
│   ├── eventoController.js
│   ├── facturaController.js
│   ├── gastoController.js
│   ├── hitoController.js
│   ├── invitadoController.js
│   ├── proveedorController.js
│   └── tareaController.js
│
├── models/                # Esquemas de Mongoose
│   ├── AuditoriaModel.js
│   ├── ClienteModel.js
│   ├── CotizacionModel.js
│   ├── EmpleadoModel.js
│   ├── EventoModel.js
│   ├── FacturaClienteModel.js
│   ├── GastoModel.js
│   ├── HitoModel.js
│   ├── InvitacionModel.js
│   ├── InvitadoModel.js
│   ├── ItemCotizacionModel.js
│   ├── ItemFacturaModel.js
│   ├── ProveedorModel.js
│   ├── TareaModel.js
│   └── UsuarioModel.js
│
├── routes/                 # Definición de rutas
│   ├── auditoriaRoutes.js
│   ├── authRoutes.js
│   ├── clienteRoutes.js
│   ├── clienteWebRoutes.js
│   ├── cotizacionRoutes.js
│   ├── empleadoRoutes.js
│   ├── eventoRoutes.js
│   ├── facturaRoutes.js
│   ├── gastoRoutes.js
│   ├── hitoRoutes.js
│   ├── invitadoRoutes.js
│   ├── proveedorRoutes.js
│   ├── rsvpRoutes.js
│   └── tareaRoutes.js
│
├── middleware/             # Middlewares
│   ├── auth.js            # Autenticación y autorización
│   ├── auditoria.js       # Registro de auditoría
│   ├── errorHandler.js    # Manejo de errores
│   ├── upload.js          # Manejo de archivos
│   └── validations.js     # Validaciones
│
├── utils/                  # Utilidades
│   ├── emailService.js    # Envío de emails
│   ├── excelImporter.js   # Importación Excel/CSV
│   ├── pdfGenerator.js   # Generación de PDFs
│   └── qrGenerator.js    # Generación de QR
│
├── views/                  # Plantillas Pug
│   ├── auth/
│   │   └── login.pug
│   ├── layout/
│   │   └── layout.pug
│   ├── clientes/
│   ├── rsvp/
│   │   └── index.pug
│   └── index.pug
│
├── tests/                  # Tests
│   ├── helpers/
│   │   └── testHelpers.js
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── clientes.test.js
│   │   ├── eventos.test.js
│   │   └── gastos.test.js
│   ├── unit/
│   │   └── models/
│   │       └── cliente.test.js
│   └── setup.js
│
├── scripts/                # Scripts auxiliares
│   └── createAdmin.js     # Crear usuario administrador
│
├── db/                     # Configuración de BD
│   └── mongoose.js
│
├── publics/                # Archivos estáticos
│
├── seed.js                 # Carga inicial de datos
├── app.js                  # Configuración principal (exporta app)
├── server.js               # Servidor de producción
├── jest.config.js         # Configuración de Jest
├── .env                    # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## 📊 Modelos de Datos

### 👤 Cliente

- `nombre`, `email`, `telefono`, `direccion`, `condicionImpositiva`, `notas`

### 🧑‍💼 Empleado

- `nombre`, `email`, `telefono`, `rol`, `area`

### 🗓️ Evento

- `nombre`, `descripcion`, `fechaInicio`, `fechaFin`, `lugar`, `presupuesto`
- `estado` (planificacion, en_curso, ejecutado, cerrado, cancelado)
- `responsables` (array de Empleados)
- `cliente` (referencia a Cliente)

### 📋 Tarea

- `titulo`, `descripcion`, `estado`, `prioridad`, `area`, `tipo`
- `empleadoAsignado`, `eventoAsignado`, `horasEstimadas`, `horasReales`

### 👥 Usuario

- `email`, `password` (hasheado), `rol`, `empleado` (referencia)
- `activo`, `ultimoAcceso`, `intentosFallidos`, `bloqueadoHasta`

### 🏢 Proveedor (RF1)

- `nombre`, `contacto`, `email`, `telefono`, `condicionImpositiva`
- `serviciosOfrecidos`, `notas`

### 📄 Cotizacion (RF1)

- `numero`, `cliente`, `evento`, `fechaEmision`, `fechaValidez`
- `estado` (borrador, pendiente, aprobada, rechazada, vencida)
- `subtotal`, `descuento`, `iva`, `total`, `margenGanancia`
- `historialVersiones`, `items` (referencias a ItemCotizacion)

### 📦 ItemCotizacion (RF1)

- `cotizacion`, `descripcion`, `categoria`, `cantidad`
- `precioUnitario`, `subtotal`, `proveedor`

### 👤 Invitado (RF2)

- `nombre`, `apellido`, `email`, `telefono`, `evento`
- `tipoInvitado`, `notas`

### ✉️ Invitacion (RF2)

- `invitado`, `evento`, `fechaEnvio`, `estadoRSVP`
- `enlaceUnico`, `fechaRespuesta`, `checkIn`, `qrCode`

### 📅 Hito (RF3)

- `nombre`, `descripcion`, `evento`, `fechaInicio`, `fechaFin`
- `responsable`, `estado` (pendiente, en_progreso, completado, atrasado, cancelado)
- `tipo` (reunion, tarea, hito, revision, entrega)
- `prioridad`, `orden`, `dependencias`

### 💸 Gasto (RF4)

- `numero`, `evento`, `proveedor`, `cotizacion`, `descripcion`
- `categoria`, `monto`, `iva`, `total`, `fecha`
- `estado` (pendiente, aprobado, pagado, cancelado)
- `metodoPago`, `aprobadoPor`

### 💰 FacturaCliente (RF4)

- `numero`, `cliente`, `evento`, `cotizacion`, `items`
- `subtotal`, `iva`, `total`, `margenPorcentaje`, `margenMonto`
- `fechaEmision`, `fechaVencimiento`, `estado` (borrador, pendiente, enviada, pagada, cancelada)
- `metodoPago`, `fechaPago`, `aprobadoPor`

### 📊 Auditoria (RNF4)

- `accion`, `entidad`, `entidadId`, `usuario`, `empleado`
- `cambios`, `datosAntes`, `datosDespues`
- `ip`, `userAgent`, `fecha`, `resultado`, `mensaje`, `metadata`
- **Inmutable**: No se puede modificar ni eliminar

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

# Email (opcional, para RF2)
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

**Login:**

```
POST /auth/login
Body: { email, password }
```

**Logout:**

```
GET /auth/logout
```

### Autenticación API (JWT)

**Login:**

```bash
POST /auth/api/login
Body: { email, password }
Response: { token, usuario, expiresIn }
```

**Usar token:**

```bash
GET /api/clientes
Headers: { Authorization: "Bearer <token>" }
```

**Verificar token:**

```bash
GET /auth/api/verify
Headers: { Authorization: "Bearer <token>" }
```

### Roles Disponibles

- **administrador**: Acceso total al sistema
- **productor**: Gestión de eventos y producción
- **financiero**: Gestión financiera y facturación
- **diseñador**: Gestión de diseño y creatividad

---

## 📡 Endpoints de la API

### 🔐 Autenticación

| Método | Endpoint                   | Descripción          | Autenticación |
| ------ | -------------------------- | -------------------- | ------------- |
| POST   | `/auth/api/login`          | Login API (JWT)      | No            |
| POST   | `/auth/login`              | Login Web (Sesión)   | No            |
| GET    | `/auth/logout`             | Logout Web           | Sí (Sesión)   |
| POST   | `/auth/api/logout`         | Logout API           | Sí (JWT)      |
| GET    | `/auth/api/verify`         | Verificar token      | Sí (JWT)      |
| POST   | `/auth/api/register`       | Registrar usuario    | Sí (Admin)    |
| POST   | `/auth/api/recovery`       | Recuperar contraseña | No            |
| POST   | `/auth/api/reset-password` | Resetear contraseña  | No            |

### 👥 Clientes

| Método | Endpoint            | Descripción         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/clientes`     | Listar todos        |
| GET    | `/api/clientes/:id` | Obtener uno         |
| POST   | `/api/clientes`     | Crear nuevo         |
| PUT    | `/api/clientes/:id` | Actualizar completo |
| PATCH  | `/api/clientes/:id` | Actualizar parcial  |
| DELETE | `/api/clientes/:id` | Eliminar            |

### 🧑‍💼 Empleados

| Método | Endpoint             | Descripción  |
| ------ | -------------------- | ------------ |
| GET    | `/api/empleados`     | Listar todos |
| GET    | `/api/empleados/:id` | Obtener uno  |
| POST   | `/api/empleados`     | Crear nuevo  |
| PUT    | `/api/empleados/:id` | Actualizar   |
| DELETE | `/api/empleados/:id` | Eliminar     |

### 🗓️ Eventos

| Método | Endpoint                        | Descripción          |
| ------ | ------------------------------- | -------------------- |
| GET    | `/api/eventos`                  | Listar (con filtros) |
| GET    | `/api/eventos/:id`              | Obtener uno          |
| GET    | `/api/eventos/:id/cronograma`   | Obtener cronograma   |
| POST   | `/api/eventos`                  | Crear nuevo          |
| PUT    | `/api/eventos/:id`              | Actualizar           |
| PATCH  | `/api/eventos/:id/estado`       | Cambiar estado       |
| POST   | `/api/eventos/:id/responsables` | Agregar responsable  |
| DELETE | `/api/eventos/:id/responsables` | Remover responsable  |
| DELETE | `/api/eventos/:id`              | Eliminar             |

**Filtros disponibles:**

- `?estado=planificacion`
- `?cliente=<clienteId>`
- `?responsable=<empleadoId>`

### 📋 Tareas

| Método | Endpoint          | Descripción            |
| ------ | ----------------- | ---------------------- |
| GET    | `/api/tareas`     | Listar (con filtros)   |
| GET    | `/api/tareas/:id` | Obtener una            |
| POST   | `/api/tareas`     | Crear (con validación) |
| PATCH  | `/api/tareas/:id` | Actualizar             |
| DELETE | `/api/tareas/:id` | Eliminar               |

**Filtros disponibles:**

- `?estado=pendiente`
- `?prioridad=alta`
- `?empleadoAsignado=<id>`
- `?eventoAsignado=<id>`
- `?fechaInicio=2025-01-01&fechaFin=2025-12-31`

### 🏢 RF1: Proveedores

| Método | Endpoint               | Descripción  |
| ------ | ---------------------- | ------------ |
| GET    | `/api/proveedores`     | Listar todos |
| GET    | `/api/proveedores/:id` | Obtener uno  |
| POST   | `/api/proveedores`     | Crear nuevo  |
| PUT    | `/api/proveedores/:id` | Actualizar   |
| DELETE | `/api/proveedores/:id` | Eliminar     |

### 📄 RF1: Cotizaciones

| Método | Endpoint                           | Descripción            |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/api/cotizaciones`                | Listar todas           |
| GET    | `/api/cotizaciones/:id`            | Obtener una            |
| GET    | `/api/cotizaciones/:id/historial`  | Historial de versiones |
| GET    | `/api/cotizaciones/:id/pdf`        | Generar PDF            |
| POST   | `/api/cotizaciones`                | Crear nueva            |
| PUT    | `/api/cotizaciones/:id`            | Actualizar             |
| POST   | `/api/cotizaciones/:id/version`    | Crear nueva versión    |
| POST   | `/api/cotizaciones/:id/aprobar`    | Aprobar cotización     |
| POST   | `/api/cotizaciones/:id/enviar`     | Enviar al cliente      |
| POST   | `/api/cotizaciones/:id/recalcular` | Recalcular totales     |
| DELETE | `/api/cotizaciones/:id`            | Eliminar               |

**Items de Cotización:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cotizaciones/:cotizacionId/items` | Listar items |
| GET | `/api/cotizaciones/items/:id` | Obtener item |
| POST | `/api/cotizaciones/items` | Crear item |
| PUT | `/api/cotizaciones/items/:id` | Actualizar item |
| DELETE | `/api/cotizaciones/items/:id` | Eliminar item |

### 👥 RF2: Invitados

| Método | Endpoint                             | Descripción              |
| ------ | ------------------------------------ | ------------------------ |
| GET    | `/api/invitados`                     | Listar todos             |
| GET    | `/api/invitados/:id`                 | Obtener uno              |
| GET    | `/api/invitados/evento/:eventoId`    | Listar por evento        |
| GET    | `/api/invitados/:id/qr`              | Generar QR               |
| POST   | `/api/invitados`                     | Crear nuevo              |
| POST   | `/api/invitados/importar`            | Importar desde Excel/CSV |
| POST   | `/api/invitados/enviar-invitaciones` | Enviar emails masivos    |
| POST   | `/api/invitados/check-in`            | Registrar check-in       |
| PUT    | `/api/invitados/:id`                 | Actualizar               |
| DELETE | `/api/invitados/:id`                 | Eliminar                 |

**RSVP Público:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/rsvp/:enlaceUnico` | Formulario RSVP (público) |
| POST | `/api/invitados/rsvp/:enlaceUnico` | Responder RSVP |

### 📅 RF3: Hitos (Cronograma)

| Método | Endpoint                      | Descripción            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/api/hitos`                  | Listar todos           |
| GET    | `/api/hitos/:id`              | Obtener uno            |
| GET    | `/api/hitos/evento/:eventoId` | Listar por evento      |
| POST   | `/api/hitos`                  | Crear nuevo            |
| PUT    | `/api/hitos/:id`              | Actualizar             |
| POST   | `/api/hitos/:id/completar`    | Marcar como completado |
| DELETE | `/api/hitos/:id`              | Eliminar               |

### 💸 RF4: Gastos

| Método | Endpoint                               | Descripción       |
| ------ | -------------------------------------- | ----------------- |
| GET    | `/api/gastos`                          | Listar todos      |
| GET    | `/api/gastos/:id`                      | Obtener uno       |
| GET    | `/api/gastos/evento/:eventoId`         | Listar por evento |
| GET    | `/api/gastos/evento/:eventoId/resumen` | Resumen de gastos |
| POST   | `/api/gastos`                          | Crear nuevo       |
| PUT    | `/api/gastos/:id`                      | Actualizar        |
| POST   | `/api/gastos/:id/aprobar`              | Aprobar gasto     |
| DELETE | `/api/gastos/:id`                      | Eliminar          |

### 💰 RF4: Facturas

| Método | Endpoint                                      | Descripción              |
| ------ | --------------------------------------------- | ------------------------ |
| GET    | `/api/facturas`                               | Listar todas             |
| GET    | `/api/facturas/:id`                           | Obtener una              |
| GET    | `/api/facturas/evento/:eventoId`              | Listar por evento        |
| GET    | `/api/facturas/evento/:eventoId/rentabilidad` | Reporte de rentabilidad  |
| POST   | `/api/facturas`                               | Crear nueva              |
| POST   | `/api/facturas/generar-desde-gastos`          | Generar desde gastos     |
| POST   | `/api/facturas/generar-desde-cotizacion`      | Generar desde cotización |
| PUT    | `/api/facturas/:id`                           | Actualizar               |
| POST   | `/api/facturas/:id/aprobar`                   | Aprobar factura          |
| POST   | `/api/facturas/:id/marcar-pagada`             | Marcar como pagada       |
| DELETE | `/api/facturas/:id`                           | Eliminar                 |

### 📊 Auditoría

| Método | Endpoint                                     | Descripción         | Autenticación         |
| ------ | -------------------------------------------- | ------------------- | --------------------- |
| GET    | `/api/auditoria`                             | Listar registros    | Sí (Admin/Financiero) |
| GET    | `/api/auditoria/resumen`                     | Resumen estadístico | Sí (Admin/Financiero) |
| GET    | `/api/auditoria/usuario/:usuarioId`          | Por usuario         | Sí (Admin/Financiero) |
| GET    | `/api/auditoria/entidad/:entidad/:entidadId` | Por entidad         | Sí (Admin/Financiero) |
| GET    | `/api/auditoria/:id`                         | Obtener registro    | Sí (Admin/Financiero) |

**Filtros disponibles:**

- `?entidad=FacturaCliente`
- `?accion=create`
- `?usuario=<usuarioId>`
- `?fechaDesde=2025-01-01&fechaHasta=2025-12-31`
- `?resultado=success`

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

- **Tests de Integración**: `tests/integration/`

  - `auth.test.js` - Autenticación
  - `clientes.test.js` - Clientes
  - `eventos.test.js` - Eventos
  - `gastos.test.js` - Gastos

- **Tests Unitarios**: `tests/unit/`

  - `models/cliente.test.js` - Modelo Cliente

- **Helpers**: `tests/helpers/testHelpers.js`
  - Funciones auxiliares para crear datos de prueba

### Configuración de Tests

- Base de datos de pruebas: `mongodb://localhost:27017/eventify-test`
- Limpieza automática después de cada test
- Variables de entorno: `NODE_ENV=test`

---

## 📚 Documentación Adicional

### Documentos Principales

- `README.md` - Documentación general del proyecto (este archivo)
- `README_BACKEND.md` - Documentación específica para la materia Backend
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

Para más información, consulta `docs/README.md`

### Ejemplos de Uso

#### Crear Cotización

```json
POST /api/cotizaciones
{
  "cliente": "64f8a1b2c3d4e5f6g7h8i9j0",
  "evento": "64f8a1b2c3d4e5f6g7h8i9j1",
  "fechaValidez": "2025-12-31",
  "margenPorcentaje": 30,
  "items": [
    {
      "descripcion": "Catering para 100 personas",
      "categoria": "Catering",
      "cantidad": 100,
      "precioUnitario": 50,
      "proveedor": "64f8a1b2c3d4e5f6g7h8i9j2"
    }
  ]
}
```

#### Enviar Invitaciones Masivas

```json
POST /api/invitados/enviar-invitaciones
{
  "eventoId": "64f8a1b2c3d4e5f6g7h8i9j1",
  "asunto": "Invitación al Evento",
  "mensaje": "Te invitamos a nuestro evento..."
}
```

#### Generar Factura desde Gastos

```json
POST /api/facturas/generar-desde-gastos
{
  "eventoId": "64f8a1b2c3d4e5f6g7h8i9j1",
  "clienteId": "64f8a1b2c3d4e5f6g7h8i9j0",
  "margenPorcentaje": 25,
  "fechaVencimiento": "2025-12-31"
}
```

#### Consultar Auditoría

```bash
GET /api/auditoria?entidad=FacturaCliente&accion=create&fechaDesde=2025-01-01
```

---

## 🔒 Seguridad

- ✅ Variables sensibles en `.env` (excluido de git)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Sesiones seguras con httpOnly cookies
- ✅ Validación de datos con express-validator
- ✅ Protección contra ataques de fuerza bruta
- ✅ Registro de auditoría inmutable
- ✅ Restricciones de modificación en facturas/gastos cerrados

---

## 📜 Scripts Disponibles

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

## 🎯 Estado del Proyecto

### ✅ Implementado

- [x] Autenticación (JWT y Passport.js)
- [x] RF1: Cotizaciones y Proveedores
- [x] RF2: Invitados y Acreditación
- [x] RF3: Cronograma y Responsables
- [x] RF4: Facturación y Cierre Contable
- [x] RNF4: Sistema de Auditoría
- [x] Testing con Jest y Supertest
- [x] Validaciones robustas
- [x] Manejo centralizado de errores
- [x] Constantes centralizadas

### ⏳ Pendiente

- [ ] Generación de PDFs para facturas
- [ ] Exportación CSV/JSON de datos financieros
- [ ] Dashboard de métricas
- [ ] Notificaciones en tiempo real
- [ ] Ampliar cobertura de tests

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
- **Documentación**: Ver carpeta `docs/` para documentación detallada de implementación y planificación

---

**🎉 ¡Gracias por usar Eventify!**
