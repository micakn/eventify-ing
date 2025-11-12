# Implementación Fase 3: Cronograma y Responsables en Eventos (RF3)

## 📋 Resumen

Se ha implementado el módulo completo de Cronograma y Responsables para eventos según los requerimientos del PDF. Este módulo permite gestionar responsables de eventos, crear hitos del cronograma, visualizar el cronograma completo (hitos + tareas) y gestionar estados de eventos.

## 🎯 Funcionalidades Implementadas

### 1. Modelos de Datos

#### **EventoModel** (Actualizado) (`models/EventoModel.js`)
- **Nuevos campos agregados:**
  - `estado` (planificacion, en_curso, ejecutado, cerrado, cancelado)
  - `responsables` (array de IDs de empleados)
  - `cliente` (referencia al cliente)

- **Nuevos métodos:**
  - `getAll(filtros)` - Listar eventos con filtros (estado, cliente, responsable)
  - `agregarResponsable(eventoId, empleadoId)` - Agregar responsable al evento
  - `removerResponsable(eventoId, empleadoId)` - Remover responsable del evento
  - `cambiarEstado(eventoId, nuevoEstado)` - Cambiar estado del evento

- **Mejoras:**
  - Populate de responsables y cliente en todas las consultas
  - Filtrado por estado, cliente y responsable
  - Validación de estados válidos

#### **HitoModel** (Nuevo) (`models/HitoModel.js`)
- Modelo completo para gestión de hitos del cronograma
- **Campos:**
  - `nombre`, `descripcion`
  - `evento` (referencia al evento)
  - `fechaInicio`, `fechaFin`
  - `responsable` (referencia al empleado)
  - `estado` (pendiente, en_progreso, completado, atrasado, cancelado)
  - `tipo` (reunion, tarea, hito, revision, entrega)
  - `prioridad` (baja, media, alta, critica)
  - `orden` (para ordenamiento)
  - `completado` (boolean)
  - `fechaCompletado`
  - `notas`
  - `dependencias` (array de IDs de otros hitos)

- **Métodos principales:**
  - `getAll(filtros)` - Listar hitos con filtros
  - `getById(id)` - Obtener hito por ID
  - `getByEvento(eventoId)` - Obtener todos los hitos de un evento
  - `getCronogramaEvento(eventoId)` - Obtener cronograma completo (hitos + tareas)
  - `add(hito)` - Crear hito
  - `update(id, hito)` - Actualizar hito
  - `patch(id, campos)` - Actualizar parcialmente hito
  - `completar(id)` - Completar hito
  - `remover(id)` - Eliminar hito
  - `removerPorEvento(eventoId)` - Eliminar todos los hitos de un evento
  - `actualizarEstadosAtrasados()` - Actualizar estados de hitos atrasados

- **Características:**
  - Middleware pre-save para actualizar estado cuando se completa
  - Índices para optimizar consultas
  - Populate de evento, responsable y dependencias
  - Validación de fechas

#### **TareaModel** (Actualizado) (`models/TareaModel.js`)
- **Mejora:**
  - `getAll(filtros)` - Ahora acepta filtros (eventoAsignado, empleadoAsignado, estado, area, prioridad)
  - Populate mejorado del evento (incluye fechaInicio, fechaFin, estado)

### 2. Controladores

#### **eventoController** (Actualizado) (`controllers/eventoController.js`)
- **Nuevos métodos:**
  - `agregarResponsable` - Agregar responsable al evento
  - `removerResponsable` - Remover responsable del evento
  - `cambiarEstado` - Cambiar estado del evento
  - `getCronograma` - Obtener cronograma completo del evento

- **Mejoras:**
  - `listEventos` - Ahora acepta filtros (estado, cliente, responsable)
  - `deleteEvento` - Elimina hitos asociados al eliminar evento

#### **hitoController** (Nuevo) (`controllers/hitoController.js`)
- Controlador completo para gestión de hitos
- **Endpoints:**
  - `listHitos` - Listar hitos (con filtros)
  - `getHito` - Obtener hito por ID
  - `getHitosPorEvento` - Obtener hitos por evento
  - `addHito` - Crear hito
  - `updateHito` - Actualizar hito
  - `patchHito` - Actualizar parcialmente hito
  - `completarHito` - Completar hito
  - `deleteHito` - Eliminar hito

### 3. Rutas

#### **eventoRoutes** (Actualizado) (`routes/eventoRoutes.js`)
- **Nuevas rutas:**
  - `GET /api/eventos/:id/cronograma` - Obtener cronograma del evento
  - `POST /api/eventos/:id/responsables` - Agregar responsable
  - `DELETE /api/eventos/:id/responsables` - Remover responsable
  - `PATCH /api/eventos/:id/estado` - Cambiar estado del evento

- **Validaciones:**
  - `validateResponsable` - Valida ID de empleado
  - `validateEstado` - Valida estado del evento

#### **hitoRoutes** (Nuevo) (`routes/hitoRoutes.js`)
- Rutas API para gestión de hitos:
  - `GET /api/hitos` - Listar hitos (con filtros)
  - `GET /api/hitos/evento/:eventoId` - Obtener hitos por evento
  - `GET /api/hitos/:id` - Obtener hito por ID
  - `POST /api/hitos` - Crear hito
  - `PUT /api/hitos/:id` - Actualizar hito
  - `PATCH /api/hitos/:id` - Actualizar parcialmente hito
  - `POST /api/hitos/:id/completar` - Completar hito
  - `DELETE /api/hitos/:id` - Eliminar hito

- **Validaciones:**
  - `validateHito` - Valida todos los campos del hito
  - Validación de fechas (fechaFin > fechaInicio)
  - Validación de IDs de MongoDB
  - Validación de estados, tipos y prioridades

### 4. Constantes

#### **constants.js** (Actualizado) (`config/constants.js`)
- **Nuevas constantes:**
  - `ESTADOS_EVENTO` - Estados de evento
  - `ESTADOS_EVENTO_ARRAY` - Array de estados de evento
  - `ESTADOS_HITO` - Estados de hito
  - `ESTADOS_HITO_ARRAY` - Array de estados de hito
  - `TIPOS_HITO` - Tipos de hito
  - `TIPOS_HITO_ARRAY` - Array de tipos de hito
  - `PRIORIDADES_HITO` - Prioridades de hito
  - `PRIORIDADES_HITO_ARRAY` - Array de prioridades de hito

### 5. Validaciones

#### **validations.js** (Actualizado) (`middleware/validations.js`)
- **Actualización de `validateEvento`:**
  - Validación de `estado` (opcional)
  - Validación de `responsables` (array de IDs)
  - Validación de `cliente` (ID de cliente)

## 📝 Uso

### 1. Crear Evento con Responsables

```bash
POST /api/eventos
Content-Type: application/json

{
  "nombre": "Conferencia Tech 2024",
  "descripcion": "Conferencia de tecnología",
  "fechaInicio": "2024-06-01",
  "fechaFin": "2024-06-03",
  "lugar": "Centro de Convenciones",
  "presupuesto": 50000,
  "estado": "planificacion",
  "responsables": ["64f8a1b2c3d4e5f6g7h8i9j0", "64f8a1b2c3d4e5f6g7h8i9j1"],
  "cliente": "64f8a1b2c3d4e5f6g7h8i9j2"
}
```

### 2. Agregar Responsable a Evento

```bash
POST /api/eventos/:id/responsables
Content-Type: application/json

{
  "empleadoId": "64f8a1b2c3d4e5f6g7h8i9j0"
}
```

### 3. Remover Responsable de Evento

```bash
DELETE /api/eventos/:id/responsables
Content-Type: application/json

{
  "empleadoId": "64f8a1b2c3d4e5f6g7h8i9j0"
}
```

### 4. Cambiar Estado de Evento

```bash
PATCH /api/eventos/:id/estado
Content-Type: application/json

{
  "estado": "en_curso"
}
```

### 5. Crear Hito

```bash
POST /api/hitos
Content-Type: application/json

{
  "nombre": "Reunión inicial con cliente",
  "descripcion": "Reunión para definir requerimientos",
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "fechaInicio": "2024-05-15T10:00:00Z",
  "fechaFin": "2024-05-15T12:00:00Z",
  "responsable": "64f8a1b2c3d4e5f6g7h8i9j1",
  "tipo": "reunion",
  "prioridad": "alta",
  "orden": 1
}
```

### 6. Obtener Cronograma de Evento

```bash
GET /api/eventos/:id/cronograma
```

**Respuesta:**
```json
{
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "cronograma": {
    "hitos": [
      {
        "id": "64f8a1b2c3d4e5f6g7h8i9j3",
        "nombre": "Reunión inicial",
        "tipo": "hito",
        "fechaInicio": "2024-05-15T10:00:00Z",
        "fechaFin": "2024-05-15T12:00:00Z",
        "estado": "completado",
        "responsable": {...},
        "prioridad": "alta",
        "completado": true
      }
    ],
    "tareas": [
      {
        "id": "64f8a1b2c3d4e5f6g7h8i9j4",
        "nombre": "Preparar presentación",
        "tipo": "tarea",
        "fechaInicio": "2024-05-10T09:00:00Z",
        "fechaFin": "2024-05-14T17:00:00Z",
        "estado": "finalizada",
        "responsable": {...},
        "prioridad": "media",
        "completado": true
      }
    ],
    "timeline": [
      // Array combinado ordenado por fecha
    ]
  }
}
```

### 7. Listar Eventos con Filtros

```bash
GET /api/eventos?estado=en_curso&responsable=64f8a1b2c3d4e5f6g7h8i9j0
```

### 8. Completar Hito

```bash
POST /api/hitos/:id/completar
```

## 🎨 Características Destacadas

1. **Gestión de Responsables**: Asignación múltiple de responsables a eventos
2. **Estados de Evento**: Seguimiento del ciclo de vida del evento (planificación → en curso → ejecutado → cerrado)
3. **Hitos del Cronograma**: Gestión completa de hitos con tipos, prioridades y dependencias
4. **Cronograma Integrado**: Vista unificada de hitos y tareas en un solo cronograma
5. **Timeline**: Ordenamiento automático por fecha de inicio
6. **Validaciones**: Validación completa de datos antes de crear/actualizar
7. **Estados Atrasados**: Detección automática de hitos atrasados
8. **Dependencias**: Soporte para dependencias entre hitos
9. **Filtrado**: Filtrado avanzado de eventos e hitos
10. **Integración**: Integración completa con módulos existentes (Tareas, Empleados, Clientes)

## 🔧 Mejoras Implementadas

1. **Modelo Evento:**
   - Agregado campo `estado` para seguimiento del ciclo de vida
   - Agregado campo `responsables` (array) para múltiples responsables
   - Agregado campo `cliente` para vincular con cliente
   - Métodos para gestión de responsables
   - Método para cambio de estado

2. **Modelo Hito:**
   - Modelo completo para hitos del cronograma
   - Soporte para dependencias entre hitos
   - Estados y prioridades configurables
   - Detección automática de hitos atrasados
   - Integración con eventos y tareas

3. **Cronograma:**
   - Vista unificada de hitos y tareas
   - Ordenamiento automático por fecha
   - Filtrado y búsqueda avanzada
   - Timeline completo del evento

## 🚀 Próximos Pasos

1. **Vista de Cronograma**: Crear vista visual del cronograma (tipo Gantt o timeline)
2. **Notificaciones**: Agregar notificaciones para hitos próximos o atrasados
3. **Dashboard**: Crear dashboard con resumen de eventos y hitos
4. **Exportación**: Agregar exportación del cronograma a PDF o Excel
5. **Integración con Calendario**: Integrar con calendarios externos (Google Calendar, etc.)
6. **Reportes**: Agregar reportes de progreso de eventos

## 📚 Referencias

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express Validator Documentation](https://express-validator.github.io/docs/)
- [MongoDB Indexes](https://docs.mongodb.com/manual/indexes/)

