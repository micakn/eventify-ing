# Implementación Sistema de Auditoría (RNF4)

## 📋 Resumen

Se ha implementado el sistema completo de auditoría según los requerimientos del PDF. Este sistema permite registrar de forma inmutable todas las acciones realizadas en el sistema, especialmente las operaciones financieras críticas (facturas, gastos, cotizaciones).

## 🎯 Funcionalidades Implementadas

### 1. Modelo de Datos

#### **AuditoriaModel** (Nuevo) (`models/AuditoriaModel.js`)
- Modelo completo para registro inmutable de auditoría
- **Campos:**
  - `accion` (create, update, delete, approve, reject, view, export, login, logout)
  - `entidad` (nombre de la entidad: FacturaCliente, Gasto, Cotizacion, etc.)
  - `entidadId` (ID de la entidad afectada)
  - `usuario` (referencia al usuario que realizó la acción)
  - `empleado` (referencia al empleado asociado)
  - `cambios` (objeto con los cambios realizados)
  - `datosAntes` (estado anterior de la entidad)
  - `datosDespues` (estado nuevo de la entidad)
  - `ip` (dirección IP del usuario)
  - `userAgent` (navegador/cliente utilizado)
  - `fecha` (fecha y hora de la acción)
  - `resultado` (success, error, warning)
  - `mensaje` (mensaje descriptivo)
  - `metadata` (información adicional)

- **Características de Inmutabilidad:**
  - Middleware pre-save: Previene modificaciones de registros existentes
  - Middleware pre-remove: Previene eliminación de registros
  - Middleware pre-deleteOne/deleteMany: Previene eliminación masiva
  - Deshabilitado versionado (`versionKey: false`)

- **Métodos principales:**
  - `getAll(filtros)` - Listar registros con filtros y paginación
  - `getById(id)` - Obtener registro por ID
  - `getByEntidad(entidad, entidadId)` - Obtener registros por entidad
  - `getByUsuario(usuarioId, filtros)` - Obtener registros por usuario
  - `getResumen(filtros)` - Obtener resumen estadístico
  - `registrar(datos)` - Registrar acción de auditoría
  - `registrarOperacionFinanciera(datos)` - Registrar operación financiera crítica

- **Índices:**
  - `fecha` (descendente) - Para consultas temporales
  - `usuario` + `fecha` - Para consultas por usuario
  - `entidad` + `entidadId` - Para consultas por entidad
  - `accion` + `fecha` - Para consultas por acción
  - `entidad` + `accion` + `fecha` - Para consultas combinadas
  - `empleado` + `fecha` - Para consultas por empleado

### 2. Middleware de Auditoría

#### **auditoria.js** (Nuevo) (`middleware/auditoria.js`)
- Middleware para registro automático de auditoría
- **Funciones principales:**
  - `registrarAuditoria(options)` - Middleware genérico para registrar auditoría
  - `auditoriaFinanciera(entidad, accion)` - Middleware específico para operaciones financieras
  - `registrarAcceso()` - Middleware para registrar accesos y vistas
  - `registrarAuditoriaManual(datos)` - Función auxiliar para registro manual
  - `registrarOperacionFinancieraManual(datos)` - Función auxiliar para operaciones financieras

- **Características:**
  - Intercepta `res.json` y `res.send` para registrar después de la respuesta
  - Registra usuario, empleado, IP, userAgent automáticamente
  - No interrumpe el flujo si falla la auditoría
  - Soporta operaciones financieras críticas con datos adicionales
  - Registra datos antes y después de la operación

### 3. Controladores

#### **auditoriaController** (Nuevo) (`controllers/auditoriaController.js`)
- Controlador para consultar registros de auditoría
- **Endpoints:**
  - `listAuditoria` - Listar registros de auditoría (con filtros y paginación)
  - `getAuditoria` - Obtener registro por ID
  - `getAuditoriaPorEntidad` - Obtener registros por entidad
  - `getAuditoriaPorUsuario` - Obtener registros por usuario
  - `getResumen` - Obtener resumen estadístico

### 4. Rutas

#### **auditoriaRoutes** (Nuevo) (`routes/auditoriaRoutes.js`)
- Rutas API para consultar registros de auditoría
- **Protección:**
  - Requiere autenticación JWT
  - Requiere rol de administrador o financiero
- **Endpoints:**
  - `GET /api/auditoria` - Listar registros (con filtros)
  - `GET /api/auditoria/resumen` - Obtener resumen estadístico
  - `GET /api/auditoria/usuario/:usuarioId` - Obtener registros por usuario
  - `GET /api/auditoria/entidad/:entidad/:entidadId` - Obtener registros por entidad
  - `GET /api/auditoria/:id` - Obtener registro por ID

### 5. Integración con Rutas Existentes

#### **facturaRoutes** (Actualizado)
- Agregado middleware `auditoriaFinanciera` a todas las rutas de facturas:
  - `POST /api/facturas` - Crear factura
  - `POST /api/facturas/generar-desde-gastos` - Generar desde gastos
  - `POST /api/facturas/generar-desde-cotizacion` - Generar desde cotización
  - `PUT /api/facturas/:id` - Actualizar factura
  - `POST /api/facturas/:id/aprobar` - Aprobar factura
  - `POST /api/facturas/:id/marcar-pagada` - Marcar como pagada
  - `DELETE /api/facturas/:id` - Eliminar factura

#### **gastoRoutes** (Actualizado)
- Agregado middleware `auditoriaFinanciera` a todas las rutas de gastos:
  - `POST /api/gastos` - Crear gasto
  - `PUT /api/gastos/:id` - Actualizar gasto
  - `POST /api/gastos/:id/aprobar` - Aprobar gasto
  - `DELETE /api/gastos/:id` - Eliminar gasto

#### **authRoutes** (Actualizado)
- Agregado registro de login y logout:
  - `POST /auth/login` - Registra login
  - `GET /auth/logout` - Registra logout
  - `POST /auth/api/login` - Registra login API

### 6. Restricciones de Modificación

#### **FacturaClienteModel** (Actualizado)
- **Restricciones agregadas:**
  - No se pueden modificar facturas con estado `pagada` o `cancelada`
  - Excepción: Se puede marcar como pagada
  - Validación en métodos `update()` y `patch()`

#### **GastoModel** (Actualizado)
- **Restricciones agregadas:**
  - No se pueden modificar gastos con estado `pagado` o `cancelado`
  - Validación en método `update()`

### 7. Constantes

#### **constants.js** (Actualizado)
- **Nuevas constantes:**
  - `ACCIONES_AUDITORIA` - Acciones de auditoría
  - `ACCIONES_AUDITORIA_ARRAY` - Array de acciones
  - `RESULTADOS_AUDITORIA` - Resultados de auditoría
  - `RESULTADOS_AUDITORIA_ARRAY` - Array de resultados

## 📝 Uso

### 1. Consultar Registros de Auditoría

```bash
GET /api/auditoria?entidad=FacturaCliente&accion=create&fechaDesde=2024-01-01&limit=50
```

**Respuesta:**
```json
{
  "mensaje": "Registros de auditoría obtenidos exitosamente",
  "registros": [
    {
      "id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "accion": "create",
      "entidad": "FacturaCliente",
      "entidadId": "64f8a1b2c3d4e5f6g7h8i9j1",
      "usuario": {
        "id": "64f8a1b2c3d4e5f6g7h8i9j2",
        "email": "admin@eventify.com",
        "rol": "administrador"
      },
      "empleado": {
        "id": "64f8a1b2c3d4e5f6g7h8i9j3",
        "nombre": "Juan Pérez",
        "rol": "planner",
        "area": "Planificación y Finanzas"
      },
      "cambios": {
        "metodo": "POST",
        "url": "/api/facturas",
        "body": {...}
      },
      "ip": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "fecha": "2024-06-15T10:30:00.000Z",
      "resultado": "success",
      "mensaje": "create FacturaCliente",
      "metadata": {
        "statusCode": 201,
        "metodo": "POST",
        "url": "/api/facturas",
        "tipo": "operacion_financiera",
        "criticidad": "alta"
      }
    }
  ],
  "total": 150,
  "limit": 50,
  "skip": 0
}
```

### 2. Obtener Resumen de Auditoría

```bash
GET /api/auditoria/resumen?fechaDesde=2024-01-01&fechaHasta=2024-12-31
```

**Respuesta:**
```json
{
  "mensaje": "Resumen de auditoría obtenido exitosamente",
  "resumen": {
    "total": 1000,
    "porAccion": {
      "create": 300,
      "update": 400,
      "delete": 50,
      "approve": 150,
      "view": 100
    },
    "porEntidad": {
      "FacturaCliente": 200,
      "Gasto": 150,
      "Cotizacion": 100,
      "Evento": 250,
      "Invitado": 300
    },
    "porUsuario": {
      "64f8a1b2c3d4e5f6g7h8i9j0": 400,
      "64f8a1b2c3d4e5f6g7h8i9j1": 300,
      "64f8a1b2c3d4e5f6g7h8i9j2": 200
    },
    "porResultado": {
      "success": 950,
      "error": 30,
      "warning": 20
    }
  }
}
```

### 3. Obtener Registros por Entidad

```bash
GET /api/auditoria/entidad/FacturaCliente/64f8a1b2c3d4e5f6g7h8i9j0
```

### 4. Obtener Registros por Usuario

```bash
GET /api/auditoria/usuario/64f8a1b2c3d4e5f6g7h8i9j0?accion=create&limit=100
```

## 🎨 Características Destacadas

1. **Inmutabilidad**: Los registros de auditoría no pueden ser modificados o eliminados
2. **Trazabilidad Completa**: Registro de todas las acciones críticas del sistema
3. **Operaciones Financieras**: Registro especial para operaciones financieras con datos adicionales
4. **Restricciones de Modificación**: Prevención de modificaciones en facturas y gastos cerrados
5. **Filtrado Avanzado**: Filtrado por entidad, acción, usuario, fecha, resultado
6. **Paginación**: Soporte para paginación en consultas
7. **Resumen Estadístico**: Resumen por acción, entidad, usuario, resultado
8. **Registro de Login/Logout**: Registro automático de accesos al sistema
9. **Información de Contexto**: IP, userAgent, fecha, hora de cada acción
10. **No Interrumpe el Flujo**: La auditoría no interrumpe las operaciones principales

## 🔧 Mejoras Implementadas

1. **Modelo Auditoria:**
   - Registro inmutable de todas las acciones
   - Soporte para operaciones financieras críticas
   - Índices optimizados para consultas rápidas
   - Middleware para prevenir modificaciones

2. **Middleware de Auditoría:**
   - Registro automático de acciones
   - Intercepción de respuestas HTTP
   - Soporte para operaciones financieras
   - No interrumpe el flujo principal

3. **Restricciones:**
   - Prevención de modificaciones en facturas cerradas
   - Prevención de modificaciones en gastos cerrados
   - Validación en modelos y controladores

4. **Rutas de Auditoría:**
   - Consulta de registros con filtros
   - Resumen estadístico
   - Consulta por entidad y usuario
   - Protección con autenticación y autorización

## 🚀 Próximos Pasos

1. **Exportación de Reportes**: Agregar exportación de reportes de auditoría a PDF/CSV
2. **Alertas**: Agregar alertas para acciones sospechosas
3. **Dashboard de Auditoría**: Crear dashboard con métricas de auditoría
4. **Integración con Sistemas Externos**: Integración con sistemas de auditoría externos
5. **Notificaciones**: Notificaciones para acciones críticas
6. **Análisis de Patrones**: Análisis de patrones de uso y comportamiento

## 📚 Referencias

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Auditoría en Sistemas Financieros](https://www.isaca.org/resources/audit)

