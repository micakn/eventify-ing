# Implementación Fase 2: Módulo de Invitados y Acreditación (RF2)

## 📋 Resumen

Se ha implementado el módulo completo de Invitados y Acreditación según los requerimientos del PDF. Este módulo permite gestionar invitados a eventos, enviar invitaciones por email, recibir respuestas RSVP, generar códigos QR para acreditación y realizar check-in de invitados.

## 🎯 Funcionalidades Implementadas

### 1. Modelos de Datos

#### **InvitadoModel** (`models/InvitadoModel.js`)
- Gestión completa de invitados con los siguientes campos:
  - `nombre`, `apellido`, `email`, `telefono`
  - `evento` (referencia al evento)
  - `estadoRSVP` (pendiente, confirmado, rechazado, talvez)
  - `codigoQR` (generado automáticamente al confirmar)
  - `fechaConfirmacion`, `fechaCheckIn`
  - `checkedIn` (boolean)
  - `categoria` (VIP, Estándar, Staff, Prensa)
  - `mesa`, `acompanantes`
  - `notas`

**Métodos principales:**
- `getAll(filtros)` - Listar invitados con filtros
- `getById(id)` - Obtener invitado por ID
- `getByEmail(email, eventoId)` - Obtener invitado por email y evento
- `getByCodigoQR(codigoQR)` - Obtener invitado por código QR
- `getByEvento(eventoId)` - Obtener todos los invitados de un evento
- `getEstadisticas(eventoId)` - Obtener estadísticas de invitados
- `add(invitado)` - Crear invitado
- `addMultiple(invitados)` - Crear múltiples invitados
- `update(id, invitado)` - Actualizar invitado
- `patch(id, campos)` - Actualizar parcialmente invitado
- `confirmarRSVP(codigoUnico, estado)` - Confirmar RSVP
- `checkIn(codigoQR)` - Realizar check-in
- `remove(id)` - Eliminar invitado

#### **InvitacionModel** (`models/InvitacionModel.js`)
- Gestión de invitaciones RSVP con los siguientes campos:
  - `invitado` (referencia al invitado)
  - `evento` (referencia al evento)
  - `enlaceUnico` (generado automáticamente)
  - `fechaEnvio`, `fechaRespuesta`
  - `estado` (enviada, abierta, respondida, expirada)
  - `respuesta` (confirmado, rechazado, talvez)
  - `intentosEnvio`, `ultimoIntentoEnvio`
  - `expiracion` (30 días por defecto)

**Métodos principales:**
- `getAll(filtros)` - Listar invitaciones con filtros
- `getById(id)` - Obtener invitación por ID
- `getByEnlaceUnico(enlaceUnico)` - Obtener invitación por enlace único
- `getByInvitado(invitadoId)` - Obtener invitación por invitado
- `getByEvento(eventoId)` - Obtener todas las invitaciones de un evento
- `add(invitacion)` - Crear invitación
- `addMultiple(invitaciones)` - Crear múltiples invitaciones
- `responder(enlaceUnico, respuesta)` - Responder RSVP
- `marcarComoAbierta(enlaceUnico)` - Marcar como abierta
- `incrementarIntentoEnvio(invitacionId)` - Incrementar intentos de envío
- `remove(id)` - Eliminar invitación

### 2. Utilidades

#### **emailService** (`utils/emailService.js`)
- Servicio de envío de emails usando nodemailer
- Funciones:
  - `enviarInvitacion(invitado, evento, enlaceRSVP)` - Enviar invitación
  - `enviarRecordatorio(invitado, evento, enlaceRSVP)` - Enviar recordatorio
  - `enviarInvitacionesMasivas(invitaciones, evento, baseURL)` - Enviar múltiples invitaciones

**Configuración:**
- Variables de entorno: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Por defecto usa Gmail (requiere configuración)

#### **qrGenerator** (`utils/qrGenerator.js`)
- Generación de códigos QR usando la librería `qrcode`
- Funciones:
  - `generarQR(data, options)` - Generar QR como Buffer
  - `generarQRDataURL(data, options)` - Generar QR como Data URL
  - `generarQRInvitado(invitado, evento)` - Generar QR para invitado

#### **excelImporter** (`utils/excelImporter.js`)
- Importación de invitados desde archivos Excel/CSV
- Funciones:
  - `leerExcel(fileBuffer, filename)` - Leer archivo Excel
  - `mapearDatosInvitados(datos, mapeo)` - Mapear datos a formato de invitado
  - `validarInvitados(invitados)` - Validar datos de invitados

**Características:**
- Detecta automáticamente columnas comunes (nombre, email, etc.)
- Permite mapeo personalizado de columnas
- Valida datos antes de importar
- Maneja errores por fila

#### **upload** (`middleware/upload.js`)
- Middleware de Multer para upload de archivos
- Configuración:
  - Almacenamiento en memoria (buffer)
  - Filtro de archivos (solo Excel y CSV)
  - Límite de tamaño: 5MB

### 3. Controladores

#### **invitadoController** (`controllers/invitadoController.js`)
- Controlador principal para gestión de invitados
- Endpoints:
  - `listInvitados` - Listar invitados (con filtros)
  - `getInvitado` - Obtener invitado por ID
  - `getEstadisticas` - Obtener estadísticas de invitados
  - `importarInvitados` - Importar invitados desde Excel
  - `addInvitado` - Crear invitado
  - `updateInvitado` - Actualizar invitado
  - `enviarInvitaciones` - Enviar invitaciones por email
  - `responderRSVP` - Responder RSVP (público)
  - `checkIn` - Realizar check-in
  - `generarQR` - Generar código QR
  - `deleteInvitado` - Eliminar invitado

### 4. Rutas

#### **invitadoRoutes** (`routes/invitadoRoutes.js`)
- Rutas API para gestión de invitados:
  - `GET /api/invitados` - Listar invitados
  - `GET /api/invitados/estadisticas` - Obtener estadísticas
  - `GET /api/invitados/:id` - Obtener invitado
  - `GET /api/invitados/:id/qr` - Generar QR
  - `POST /api/invitados` - Crear invitado
  - `POST /api/invitados/importar` - Importar desde Excel
  - `POST /api/invitados/enviar-invitaciones` - Enviar invitaciones
  - `PUT /api/invitados/:id` - Actualizar invitado
  - `POST /api/invitados/check-in` - Realizar check-in
  - `DELETE /api/invitados/:id` - Eliminar invitado
  - `POST /api/invitados/rsvp/:enlaceUnico` - Responder RSVP (público)

#### **rsvpRoutes** (`routes/rsvpRoutes.js`)
- Rutas públicas para RSVP:
  - `GET /rsvp/:enlaceUnico` - Mostrar formulario RSVP

### 5. Vistas

#### **rsvp/index.pug** (`views/rsvp/index.pug`)
- Vista pública para responder RSVP
- Características:
  - Muestra información del evento
  - Formulario para confirmar/rechazar/talvez
  - Validación de estado (expirada, ya respondida)
  - Envío asíncrono de respuesta

## 🔧 Configuración

### Variables de Entorno

Agregar al archivo `.env`:

```env
# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password
SMTP_FROM=Eventify <noreply@eventify.com>

# Base URL para enlaces RSVP
BASE_URL=http://localhost:3000
```

### Dependencias Instaladas

```json
{
  "nodemailer": "^6.9.0",
  "qrcode": "^1.5.3",
  "xlsx": "^0.18.5",
  "multer": "^1.4.5"
}
```

## 📝 Uso

### 1. Crear Invitado

```bash
POST /api/invitados
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "+541112345678",
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "categoria": "VIP",
  "acompanantes": 1
}
```

### 2. Importar Invitados desde Excel

```bash
POST /api/invitados/importar
Content-Type: multipart/form-data

archivo: [archivo.xlsx]
evento: "64f8a1b2c3d4e5f6g7h8i9j0"
mapeo: {"nombre": "Nombre", "email": "Email"} (opcional)
```

### 3. Enviar Invitaciones

```bash
POST /api/invitados/enviar-invitaciones
Content-Type: application/json

{
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "invitados": ["64f8a1b2c3d4e5f6g7h8i9j1", "64f8a1b2c3d4e5f6g7h8i9j2"], // opcional
  "recordatorio": false // opcional
}
```

### 4. Responder RSVP (Público)

```bash
# Ver formulario
GET /rsvp/RSVP-64f8a1b2c3d4e5f6g7h8i9j0-token123

# Responder
POST /api/invitados/rsvp/RSVP-64f8a1b2c3d4e5f6g7h8i9j0-token123
Content-Type: application/json

{
  "respuesta": "confirmado" // o "rechazado" o "talvez"
}
```

### 5. Check-In

```bash
POST /api/invitados/check-in
Content-Type: application/json

{
  "codigoQR": "QR-64f8a1b2c3d4e5f6g7h8i9j0-abc123"
}
```

### 6. Generar QR

```bash
GET /api/invitados/:id/qr
```

### 7. Obtener Estadísticas

```bash
GET /api/invitados/estadisticas?evento=64f8a1b2c3d4e5f6g7h8i9j0
```

**Respuesta:**
```json
{
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "estadisticas": {
    "total": 100,
    "confirmados": 80,
    "pendientes": 15,
    "rechazados": 3,
    "talvez": 2,
    "checkedIn": 75,
    "noShow": 5,
    "totalAcompanantes": 20,
    "totalAsistentes": 95
  }
}
```

## 🎨 Características Destacadas

1. **Generación Automática de Códigos QR**: Se generan automáticamente al confirmar asistencia
2. **Envío Masivo de Invitaciones**: Permite enviar invitaciones a múltiples invitados
3. **Importación desde Excel**: Importa invitados desde archivos Excel/CSV
4. **Estadísticas en Tiempo Real**: Estadísticas completas de invitados por evento
5. **Check-In con QR**: Sistema de acreditación mediante códigos QR
6. **RSVP Público**: Formulario público para responder invitaciones
7. **Validación de Datos**: Validación completa de datos antes de importar/crear
8. **Manejo de Errores**: Manejo robusto de errores en todas las operaciones

## 🚀 Próximos Pasos

1. **Configurar SMTP**: Configurar servidor de email para envío de invitaciones
2. **Mejorar UI**: Mejorar interfaz de usuario para gestión de invitados
3. **Notificaciones**: Agregar notificaciones por email para recordatorios
4. **Dashboard**: Crear dashboard con estadísticas visuales
5. **Exportación**: Agregar exportación de listas de invitados a Excel
6. **Integración con Eventos**: Integrar mejor con el módulo de eventos

## 📚 Referencias

- [Nodemailer Documentation](https://nodemailer.com/about/)
- [QRCode Documentation](https://www.npmjs.com/package/qrcode)
- [XLSX Documentation](https://www.npmjs.com/package/xlsx)
- [Multer Documentation](https://www.npmjs.com/package/multer)

