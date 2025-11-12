# 📋 Fase 2: Módulo de Cotizaciones (RF1) - COMPLETADA

## ✅ Resumen de Implementación

Se ha implementado el módulo completo de **Registro y Seguimiento de Cotizaciones (RF1)** según los requerimientos del PDF de Ingeniería de Software.

---

## 📦 Archivos Creados

### **Modelos:**
1. **`models/ProveedorModel.js`**
   - Gestión de proveedores
   - Servicios y tarifas de referencia
   - Condición impositiva
   - Soft delete (marcar como inactivo)

2. **`models/CotizacionModel.js`**
   - Cotizaciones con número único
   - Cálculo automático de márgenes e IVA
   - Sistema de versionado
   - Estados: borrador, pendiente, aprobada, rechazada, vencida
   - Historial de versiones

3. **`models/ItemCotizacionModel.js`**
   - Items de cotización
   - Cálculo automático de subtotal
   - Categorías: Catering, Sonido, Iluminación, Decoración, Logística, Otros

### **Controladores:**
1. **`controllers/proveedorController.js`**
   - CRUD completo de proveedores
   - Búsqueda por servicio

2. **`controllers/cotizacionController.js`**
   - CRUD completo de cotizaciones
   - Crear nueva versión
   - Aprobar cotización
   - Enviar cotización
   - Recalcular totales
   - Generar PDF
   - Obtener historial de versiones

3. **`controllers/itemCotizacionController.js`**
   - CRUD de items
   - Gestión de items por cotización

### **Rutas:**
1. **`routes/proveedorRoutes.js`**
   - Todas las rutas con validaciones

2. **`routes/cotizacionRoutes.js`**
   - Rutas de cotizaciones
   - Rutas de items anidadas
   - Endpoint para generar PDF

### **Utilidades:**
1. **`utils/pdfGenerator.js`**
   - Generación de PDFs de cotizaciones
   - Formato profesional con logo, datos del cliente, items y totales

---

## 🔑 Funcionalidades Implementadas

### **1. Gestión de Proveedores**
- ✅ Crear, editar, eliminar proveedores
- ✅ Registrar servicios y tarifas de referencia
- ✅ Condición impositiva
- ✅ Búsqueda por servicio
- ✅ Soft delete (marcar como inactivo)

### **2. Gestión de Cotizaciones**
- ✅ Crear cotizaciones con número único (COT-YYYY-####)
- ✅ Agregar items con proveedores
- ✅ Cálculo automático de:
  - Subtotal (suma de items)
  - Margen (porcentaje configurable)
  - IVA (21% sobre subtotal + margen)
  - Total final
- ✅ Estados: borrador, pendiente, aprobada, rechazada, vencida
- ✅ Sistema de versionado completo
- ✅ Historial de versiones
- ✅ Aprobación de cotizaciones
- ✅ Envío de cotizaciones (cambia estado a pendiente)
- ✅ Recalcular totales automáticamente

### **3. Gestión de Items**
- ✅ Crear, editar, eliminar items
- ✅ Cálculo automático de subtotal (cantidad × precio unitario)
- ✅ Categorización de items
- ✅ Relación con proveedores
- ✅ Actualización automática de totales de cotización

### **4. Generación de PDFs**
- ✅ PDF profesional con:
  - Encabezado con logo/nombre
  - Información de la cotización
  - Datos del cliente
  - Datos del evento
  - Tabla de items detallada
  - Totales (subtotal, margen, IVA, total)
  - Observaciones
  - Pie de página

---

## 📋 Endpoints Implementados

### **Proveedores**
- `GET /api/proveedores` - Listar todos
- `GET /api/proveedores?servicio=catering` - Buscar por servicio
- `GET /api/proveedores/:id` - Obtener uno
- `POST /api/proveedores` - Crear nuevo
- `PUT /api/proveedores/:id` - Actualizar completo
- `PATCH /api/proveedores/:id` - Actualizar parcial
- `DELETE /api/proveedores/:id` - Eliminar (soft delete)

### **Cotizaciones**
- `GET /api/cotizaciones` - Listar todas
- `GET /api/cotizaciones?cliente=ID&estado=pendiente` - Filtrar
- `GET /api/cotizaciones/:id` - Obtener una
- `GET /api/cotizaciones/:id/historial` - Historial de versiones
- `GET /api/cotizaciones/:id/pdf` - Generar PDF
- `POST /api/cotizaciones` - Crear nueva
- `PUT /api/cotizaciones/:id` - Actualizar completa
- `PATCH /api/cotizaciones/:id` - Actualizar parcial
- `POST /api/cotizaciones/:id/version` - Crear nueva versión
- `POST /api/cotizaciones/:id/aprobar` - Aprobar cotización
- `POST /api/cotizaciones/:id/enviar` - Enviar al cliente
- `POST /api/cotizaciones/:id/recalcular` - Recalcular totales
- `DELETE /api/cotizaciones/:id` - Eliminar

### **Items de Cotización**
- `GET /api/cotizaciones/:cotizacionId/items` - Items de una cotización
- `GET /api/cotizaciones/items/:id` - Obtener un item
- `POST /api/cotizaciones/items` - Crear item
- `PUT /api/cotizaciones/items/:id` - Actualizar item
- `DELETE /api/cotizaciones/items/:id` - Eliminar item

---

## 📝 Ejemplos de Uso

### **Crear una Cotización Completa**

```bash
POST /api/cotizaciones
Content-Type: application/json

{
  "cliente": "ID_CLIENTE",
  "evento": "ID_EVENTO",
  "margenPorcentaje": 25,
  "items": [
    {
      "proveedor": "ID_PROVEEDOR_1",
      "descripcion": "Servicio de catering para 100 personas",
      "categoria": "Catering",
      "cantidad": 100,
      "unidad": "persona",
      "precioUnitario": 5000
    },
    {
      "proveedor": "ID_PROVEEDOR_2",
      "descripcion": "Equipo de sonido completo",
      "categoria": "Sonido",
      "cantidad": 1,
      "unidad": "evento",
      "precioUnitario": 150000
    }
  ],
  "observaciones": "Incluye montaje y desmontaje"
}
```

**Respuesta:**
```json
{
  "mensaje": "Cotización creada exitosamente",
  "cotizacion": {
    "id": "...",
    "numero": "COT-2025-0001",
    "version": 1,
    "subtotal": 650000,
    "margenPorcentaje": 25,
    "margenMonto": 162500,
    "iva": 170625,
    "total": 983125,
    "estado": "borrador",
    ...
  }
}
```

### **Generar PDF**

```bash
GET /api/cotizaciones/:id/pdf
```

Devuelve el PDF directamente para descargar.

### **Crear Nueva Versión**

```bash
POST /api/cotizaciones/:id/version
Content-Type: application/json

{
  "items": [
    {
      "proveedor": "ID_PROVEEDOR",
      "descripcion": "Item actualizado",
      "cantidad": 2,
      "precioUnitario": 10000
    }
  ],
  "margenPorcentaje": 30
}
```

---

## ✅ Checklist de Requerimientos (RF1)

Según el PDF de Ingeniería de Software:

- [x] **Crear, guardar y actualizar cotizaciones**
- [x] **Número único de cotización**
- [x] **Estados: pendiente/aprobada/rechazada** (+ borrador, vencida)
- [x] **Cálculo automático de márgenes**
- [x] **Historial de versiones**
- [x] **Plantillas estandarizadas** (estructura fija)
- [x] **Generación de PDF** con formato institucional
- [x] **Registro de datos de proveedores y costos**
- [x] **Fecha de envío y versión**

---

## 🔧 Mejoras Técnicas

1. **Cálculo Automático:**
   - Los totales se calculan automáticamente en el pre-save
   - Recalcular totales cuando se modifican items

2. **Versionado:**
   - Cada versión mantiene referencia a la anterior
   - Historial completo accesible

3. **Validaciones:**
   - Validación de referencias (cliente, evento, proveedor existen)
   - Validación de datos numéricos
   - Validación de estados

4. **Integridad:**
   - Al eliminar cotización, se eliminan items asociados
   - Al eliminar item, se actualiza la cotización

---

## ⚠️ Notas Importantes

1. **Números de Cotización:**
   - Formato: `COT-YYYY-####`
   - Se generan automáticamente
   - Únicos por año

2. **Cálculo de Totales:**
   - Se ejecuta automáticamente al guardar
   - Se puede forzar con `/recalcular`

3. **PDFs:**
   - Se generan en memoria (no se guardan en disco)
   - Se pueden descargar directamente
   - Formato profesional listo para enviar

4. **Versionado:**
   - Cada versión tiene su propio número
   - Mantiene referencia a la versión anterior
   - Permite rastrear cambios

---

## 🚀 Próximos Pasos

1. **Agregar datos de prueba** en seed.js
2. **Implementar RF2: Invitados** (siguiente módulo)
3. **Mejorar PDFs** con logo real si está disponible
4. **Agregar envío de emails** con PDF adjunto

---

**Fecha de implementación:** 2025
**Estado:** ✅ Completado - Listo para pruebas

