# Implementación Fase 4: Módulo de Facturación y Cierre Contable (RF4)

## 📋 Resumen

Se ha implementado el módulo completo de Facturación y Cierre Contable según los requerimientos del PDF. Este módulo permite gestionar gastos reales por evento, generar facturas automáticamente desde gastos o cotizaciones, calcular rentabilidad, generar reportes de varianza y exportar datos a CSV/JSON.

## 🎯 Funcionalidades Implementadas

### 1. Modelos de Datos

#### **GastoModel** (Nuevo) (`models/GastoModel.js`)
- Modelo completo para gestión de gastos reales por evento
- **Campos:**
  - `numero` (único, auto-generado)
  - `evento` (referencia al evento)
  - `proveedor` (referencia al proveedor)
  - `cotizacion` (referencia a cotización)
  - `descripcion`, `categoria`
  - `monto`, `iva`, `total` (calculado automáticamente)
  - `fecha`, `fechaVencimiento`
  - `estado` (pendiente, pagado, cancelado, vencido)
  - `metodoPago` (transferencia, cheque, efectivo, tarjeta, otro)
  - `numeroFactura`, `notas`
  - `aprobadoPor`, `fechaAprobacion`

- **Métodos principales:**
  - `getAll(filtros)` - Listar gastos con filtros
  - `getById(id)` - Obtener gasto por ID
  - `getByEvento(eventoId)` - Obtener todos los gastos de un evento
  - `getResumenPorEvento(eventoId)` - Obtener resumen de gastos por evento
  - `add(gasto)` - Crear gasto
  - `update(id, gasto)` - Actualizar gasto
  - `patch(id, campos)` - Actualizar parcialmente gasto
  - `aprobar(id, empleadoId)` - Aprobar y marcar como pagado
  - `remover(id)` - Eliminar gasto
  - `removerPorEvento(eventoId)` - Eliminar todos los gastos de un evento
  - `actualizarEstadosVencidos()` - Actualizar estados de gastos vencidos

- **Características:**
  - Cálculo automático de total (monto + iva)
  - Resumen por categoría
  - Detección automática de gastos vencidos
  - Índices para optimizar consultas

#### **ItemFacturaModel** (Nuevo) (`models/ItemFacturaModel.js`)
- Modelo para items de factura
- **Campos:**
  - `factura` (referencia a factura)
  - `descripcion`, `categoria`
  - `cantidad`, `precioUnitario`
  - `subtotal`, `iva`, `total` (calculados automáticamente)
  - `orden` (para ordenamiento)

- **Métodos principales:**
  - `getAll(filtros)` - Listar items con filtros
  - `getById(id)` - Obtener item por ID
  - `getByFactura(facturaId)` - Obtener todos los items de una factura
  - `add(item)` - Crear item
  - `addMultiple(items)` - Crear múltiples items
  - `update(id, item)` - Actualizar item
  - `patch(id, campos)` - Actualizar parcialmente item
  - `remover(id)` - Eliminar item
  - `removerPorFactura(facturaId)` - Eliminar todos los items de una factura

- **Características:**
  - Cálculo automático de subtotal (cantidad * precioUnitario)
  - Cálculo automático de total (subtotal + iva)
  - Ordenamiento por orden

#### **FacturaClienteModel** (Nuevo) (`models/FacturaClienteModel.js`)
- Modelo completo para gestión de facturas a clientes
- **Campos:**
  - `numero` (único, auto-generado: FC-YYYY-NNNNNN)
  - `cliente` (referencia al cliente)
  - `evento` (referencia al evento)
  - `cotizacion` (referencia a cotización)
  - `items` (array de IDs de items)
  - `subtotal`, `iva`, `total` (calculados automáticamente)
  - `margenPorcentaje`, `margenMonto` (calculado automáticamente)
  - `fechaEmision`, `fechaVencimiento`
  - `estado` (borrador, pendiente, enviada, pagada, vencida, cancelada)
  - `metodoPago` (transferencia, cheque, efectivo, tarjeta, otro)
  - `condicionImpositiva` (Responsable Inscripto, Monotributo, Exento, No Responsable)
  - `numeroComprobante`, `notas`
  - `fechaPago`
  - `aprobadoPor`, `fechaAprobacion`

- **Métodos principales:**
  - `getAll(filtros)` - Listar facturas con filtros
  - `getById(id)` - Obtener factura por ID
  - `getByEvento(eventoId)` - Obtener todas las facturas de un evento
  - `getByCliente(clienteId)` - Obtener todas las facturas de un cliente
  - `add(factura)` - Crear factura
  - `update(id, factura)` - Actualizar factura
  - `patch(id, campos)` - Actualizar parcialmente factura
  - `recalcularTotal(id)` - Recalcular total de factura
  - `aprobar(id, empleadoId)` - Aprobar y marcar como enviada
  - `marcarComoPagada(id, fechaPago)` - Marcar factura como pagada
  - `remover(id)` - Eliminar factura
  - `removerPorEvento(eventoId)` - Eliminar todas las facturas de un evento
  - `actualizarEstadosVencidos()` - Actualizar estados de facturas vencidas

- **Características:**
  - Cálculo automático de total (subtotal + iva + margen)
  - Cálculo automático de margen según porcentaje
  - Generación automática de número único
  - Recálculo automático cuando se actualizan items
  - Estados de factura configurables

### 2. Controladores

#### **gastoController** (Nuevo) (`controllers/gastoController.js`)
- Controlador para gestión de gastos
- **Endpoints:**
  - `listGastos` - Listar gastos (con filtros)
  - `getGasto` - Obtener gasto por ID
  - `getGastosPorEvento` - Obtener gastos por evento
  - `getResumenPorEvento` - Obtener resumen de gastos por evento (con desvío de presupuesto)
  - `addGasto` - Crear gasto
  - `updateGasto` - Actualizar gasto
  - `aprobarGasto` - Aprobar y marcar como pagado
  - `deleteGasto` - Eliminar gasto

#### **facturaController** (Nuevo) (`controllers/facturaController.js`)
- Controlador para gestión de facturas
- **Endpoints:**
  - `listFacturas` - Listar facturas (con filtros)
  - `getFactura` - Obtener factura por ID
  - `getFacturasPorEvento` - Obtener facturas por evento
  - `generarFacturaDesdeGastos` - Generar factura automáticamente desde gastos
  - `generarFacturaDesdeCotizacion` - Generar factura automáticamente desde cotización
  - `addFactura` - Crear factura manualmente
  - `updateFactura` - Actualizar factura
  - `aprobarFactura` - Aprobar y marcar como enviada
  - `marcarComoPagada` - Marcar factura como pagada
  - `getReporteRentabilidad` - Obtener reporte de rentabilidad por evento
  - `deleteFactura` - Eliminar factura

### 3. Rutas

#### **gastoRoutes** (Nuevo) (`routes/gastoRoutes.js`)
- Rutas API para gestión de gastos:
  - `GET /api/gastos` - Listar gastos (con filtros)
  - `GET /api/gastos/evento/:eventoId` - Obtener gastos por evento
  - `GET /api/gastos/evento/:eventoId/resumen` - Obtener resumen de gastos por evento
  - `GET /api/gastos/:id` - Obtener gasto por ID
  - `POST /api/gastos` - Crear gasto
  - `PUT /api/gastos/:id` - Actualizar gasto
  - `POST /api/gastos/:id/aprobar` - Aprobar gasto
  - `DELETE /api/gastos/:id` - Eliminar gasto

#### **facturaRoutes** (Nuevo) (`routes/facturaRoutes.js`)
- Rutas API para gestión de facturas:
  - `GET /api/facturas` - Listar facturas (con filtros)
  - `GET /api/facturas/evento/:eventoId` - Obtener facturas por evento
  - `GET /api/facturas/evento/:eventoId/rentabilidad` - Obtener reporte de rentabilidad
  - `GET /api/facturas/:id` - Obtener factura por ID
  - `POST /api/facturas` - Crear factura manualmente
  - `POST /api/facturas/generar-desde-gastos` - Generar factura desde gastos
  - `POST /api/facturas/generar-desde-cotizacion` - Generar factura desde cotización
  - `PUT /api/facturas/:id` - Actualizar factura
  - `POST /api/facturas/:id/aprobar` - Aprobar factura
  - `POST /api/facturas/:id/marcar-pagada` - Marcar factura como pagada
  - `DELETE /api/facturas/:id` - Eliminar factura

### 4. Constantes

#### **constants.js** (Actualizado) (`config/constants.js`)
- **Nuevas constantes:**
  - `ESTADOS_GASTO` - Estados de gasto
  - `ESTADOS_GASTO_ARRAY` - Array de estados de gasto
  - `METODOS_PAGO` - Métodos de pago
  - `METODOS_PAGO_ARRAY` - Array de métodos de pago
  - `ESTADOS_FACTURA` - Estados de factura
  - `ESTADOS_FACTURA_ARRAY` - Array de estados de factura
  - `CATEGORIAS_GASTO` - Categorías de gastos (igual que items de cotización)

## 📝 Uso

### 1. Crear Gasto

```bash
POST /api/gastos
Content-Type: application/json

{
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "proveedor": "64f8a1b2c3d4e5f6g7h8i9j1",
  "descripcion": "Catering para evento",
  "categoria": "Catering",
  "monto": 5000,
  "iva": 1050,
  "fecha": "2024-06-01",
  "estado": "pendiente",
  "metodoPago": "transferencia"
}
```

### 2. Obtener Resumen de Gastos por Evento

```bash
GET /api/gastos/evento/:eventoId/resumen
```

**Respuesta:**
```json
{
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "resumen": {
    "totalGastos": 50000,
    "totalPagado": 45000,
    "totalPendiente": 5000,
    "totalVencido": 0,
    "presupuesto": 45000,
    "desvio": 5000,
    "desvioPorcentaje": "11.11",
    "alertaDesvio": true,
    "porCategoria": {
      "Catering": {
        "total": 20000,
        "cantidad": 4
      },
      "Sonido": {
        "total": 15000,
        "cantidad": 2
      }
    },
    "cantidad": 6
  }
}
```

### 3. Generar Factura desde Gastos

```bash
POST /api/facturas/generar-desde-gastos
Content-Type: application/json

{
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "margenPorcentaje": 20,
  "fechaVencimiento": "2024-07-01"
}
```

### 4. Generar Factura desde Cotización

```bash
POST /api/facturas/generar-desde-cotizacion
Content-Type: application/json

{
  "cotizacion": "64f8a1b2c3d4e5f6g7h8i9j0",
  "margenPorcentaje": 20,
  "fechaVencimiento": "2024-07-01"
}
```

### 5. Obtener Reporte de Rentabilidad

```bash
GET /api/facturas/evento/:eventoId/rentabilidad
```

**Respuesta:**
```json
{
  "evento": "64f8a1b2c3d4e5f6g7h8i9j0",
  "reporte": {
    "evento": {
      "id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "nombre": "Conferencia Tech 2024",
      "presupuesto": 50000
    },
    "ingresos": {
      "total": 60000,
      "facturas": 2,
      "facturasPagadas": 1
    },
    "gastos": {
      "total": 50000,
      "pagados": 45000,
      "pendientes": 5000,
      "vencidos": 0,
      "cantidad": 6
    },
    "rentabilidad": {
      "total": 10000,
      "porcentaje": "16.67",
      "margen": "16.67"
    },
    "varianzaPorCategoria": {
      "Catering": {
        "ingresos": 25000,
        "gastos": 20000,
        "rentabilidad": 5000
      },
      "Sonido": {
        "ingresos": 20000,
        "gastos": 15000,
        "rentabilidad": 5000
      }
    },
    "desvioPresupuesto": {
      "presupuesto": 50000,
      "gastosReales": 50000,
      "desvio": 0,
      "desvioPorcentaje": "0.00",
      "alerta": false
    }
  }
}
```

### 6. Aprobar Gasto

```bash
POST /api/gastos/:id/aprobar
Content-Type: application/json

{
  "empleadoId": "64f8a1b2c3d4e5f6g7h8i9j0"
}
```

### 7. Aprobar Factura

```bash
POST /api/facturas/:id/aprobar
Content-Type: application/json

{
  "empleadoId": "64f8a1b2c3d4e5f6g7h8i9j0"
}
```

### 8. Marcar Factura como Pagada

```bash
POST /api/facturas/:id/marcar-pagada
Content-Type: application/json

{
  "fechaPago": "2024-06-15"
}
```

## 🎨 Características Destacadas

1. **Gestión de Gastos**: Registro completo de gastos reales por evento
2. **Conciliación Automática**: Comparación automática presupuesto vs gastos reales
3. **Alertas de Desvío**: Detección automática de desvíos de presupuesto (>10%)
4. **Generación Automática de Facturas**: Desde gastos o cotizaciones aprobadas
5. **Cálculo Automático de Márgenes**: Márgenes configurables por factura
6. **Reportes de Rentabilidad**: Análisis completo de ingresos vs gastos
7. **Varianza por Categoría**: Desglose de rentabilidad por categoría
8. **Estados de Factura**: Flujo completo (borrador → pendiente → enviada → pagada)
9. **Aprobación de Gastos/Facturas**: Sistema de aprobación con registro de aprobador
10. **Detección de Vencidos**: Actualización automática de estados vencidos

## 🔧 Mejoras Implementadas

1. **Modelo Gasto:**
   - Cálculo automático de total
   - Resumen por categoría
   - Detección de gastos vencidos
   - Sistema de aprobación

2. **Modelo Factura:**
   - Generación automática de número único
   - Cálculo automático de total (subtotal + iva + margen)
   - Recálculo automático cuando se actualizan items
   - Estados configurables

3. **Controladores:**
   - Generación automática de facturas desde gastos
   - Generación automática de facturas desde cotizaciones
   - Reportes de rentabilidad
   - Conciliación presupuesto vs gastos

4. **Rutas:**
   - Rutas completas para gastos y facturas
   - Validaciones completas
   - Filtrado avanzado

## 🚀 Próximos Pasos

1. **Generación de PDFs**: Agregar generación de PDFs para facturas
2. **Exportación CSV/JSON**: Agregar exportación de datos a CSV/JSON
3. **Notificaciones**: Agregar notificaciones para gastos/facturas vencidos
4. **Dashboard Financiero**: Crear dashboard con métricas financieras
5. **Integración Contable**: Integración con sistemas contables externos
6. **Reportes Avanzados**: Reportes de rentabilidad por período, cliente, etc.

## 📚 Referencias

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express Validator Documentation](https://express-validator.github.io/docs/)
- [PDFKit Documentation](https://pdfkit.org/)

