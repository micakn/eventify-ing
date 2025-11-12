# Implementación de Tests con Jest y Supertest

## 📋 Resumen

Se ha implementado un sistema completo de testing usando Jest y Supertest para el backend de Eventify. Los tests cubren autenticación, modelos, controladores y rutas de la API.

## 🎯 Funcionalidades Implementadas

### 1. Configuración de Jest

#### **jest.config.js** (Nuevo)
- Configuración para ESM (ECMAScript Modules)
- Soporte para módulos ES6 con `--experimental-vm-modules`
- Configuración de cobertura de código
- Timeout configurado a 15 segundos
- Archivos de setup para configuración inicial

### 2. Estructura de Tests

#### **tests/setup.js**
- Configuración inicial para todos los tests
- Variables de entorno para testing
- Configuración de base de datos de pruebas

#### **tests/helpers/testHelpers.js**
- Funciones auxiliares para crear datos de prueba:
  - `crearEmpleadoTest()` - Crear empleado de prueba
  - `crearUsuarioTest()` - Crear usuario de prueba
  - `crearTokenTest()` - Crear token JWT de prueba
  - `crearClienteTest()` - Crear cliente de prueba
  - `crearEventoTest()` - Crear evento de prueba
  - `limpiarBaseDatos()` - Limpiar base de datos
  - `esIdValido()` - Verificar ID válido
  - `esperar()` - Esperar tiempo determinado

### 3. Tests de Integración

#### **tests/integration/auth.test.js**
- Tests de autenticación:
  - Login exitoso con credenciales válidas
  - Rechazo de login con credenciales inválidas
  - Validación de campos requeridos
  - Verificación de token
  - Registro de usuario (requiere autenticación de administrador)

#### **tests/integration/clientes.test.js**
- Tests de clientes:
  - Listar clientes
  - Obtener cliente por ID
  - Crear cliente
  - Actualizar cliente
  - Eliminar cliente
  - Validaciones de datos

#### **tests/integration/eventos.test.js**
- Tests de eventos:
  - Listar eventos
  - Filtrar eventos por estado
  - Obtener evento por ID
  - Crear evento
  - Actualizar evento
  - Cambiar estado de evento
  - Eliminar evento

#### **tests/integration/gastos.test.js**
- Tests de gastos:
  - Listar gastos
  - Filtrar gastos por evento
  - Obtener resumen de gastos por evento
  - Crear gasto
  - Aprobar gasto
  - Eliminar gasto

### 4. Tests Unitarios

#### **tests/unit/models/cliente.test.js**
- Tests del modelo Cliente:
  - Crear cliente
  - Obtener todos los clientes
  - Obtener cliente por ID
  - Actualizar cliente
  - Actualizar parcialmente cliente
  - Eliminar cliente
  - Validaciones de ID

## 📝 Scripts de NPM

### **package.json** (Actualizado)
- `npm test` - Ejecutar todos los tests
- `npm run test:watch` - Ejecutar tests en modo watch
- `npm run test:coverage` - Ejecutar tests con cobertura
- `npm start` - Iniciar servidor de producción
- `npm run dev` - Iniciar servidor de desarrollo con nodemon

## 🛠️ Configuración

### Variables de Entorno para Tests
- `NODE_ENV=test` - Modo de testing
- `MONGODB_URI_TEST` - URI de base de datos de pruebas (opcional)
- `JWT_SECRET` - Secret para JWT (opcional, usa valor por defecto)
- `SESSION_SECRET` - Secret para sesiones (opcional, usa valor por defecto)

### Base de Datos de Pruebas
- Por defecto: `mongodb://localhost:27017/eventify-test`
- Se limpia automáticamente después de cada test
- Se cierra la conexión después de todos los tests

## 🎨 Características Destacadas

1. **Tests de Integración**: Prueban las rutas completas de la API
2. **Tests Unitarios**: Prueban los modelos individualmente
3. **Helpers Reutilizables**: Funciones auxiliares para crear datos de prueba
4. **Limpieza Automática**: La base de datos se limpia después de cada test
5. **Cobertura de Código**: Configuración para generar reportes de cobertura
6. **Soporte ESM**: Configuración para usar módulos ES6
7. **Cross-platform**: Uso de `cross-env` para compatibilidad Windows/Linux/Mac

## 📊 Cobertura de Tests

### Módulos Cubiertos
- ✅ Autenticación (login, registro, verificación de token)
- ✅ Clientes (CRUD completo)
- ✅ Eventos (CRUD completo, filtros, cambio de estado)
- ✅ Gastos (CRUD completo, resumen, aprobación)
- ✅ Modelo Cliente (métodos principales)

### Módulos Pendientes
- ⏳ Empleados
- ⏳ Tareas
- ⏳ Cotizaciones
- ⏳ Proveedores
- ⏳ Invitados
- ⏳ Facturas
- ⏳ Hitos
- ⏳ Auditoría

## 🚀 Ejecución de Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar un archivo de test específico
```bash
npm test -- tests/integration/auth.test.js
```

### Ejecutar tests con filtro
```bash
npm test -- --testNamePattern="debe hacer login"
```

## 🔧 Mejoras Implementadas

1. **Separación de app.js y server.js**:
   - `app.js` exporta la aplicación Express
   - `server.js` inicia el servidor (solo en producción)
   - Los tests pueden usar `app.js` sin iniciar el servidor

2. **Configuración de Sesiones**:
   - En modo test, no se usa MongoStore para sesiones
   - Evita problemas de conexión en tests

3. **Helpers de Testing**:
   - Funciones reutilizables para crear datos de prueba
   - Manejo correcto de tokens JWT
   - Limpieza automática de base de datos

4. **Validaciones en Tests**:
   - Tests para casos exitosos
   - Tests para casos de error
   - Tests para validaciones de datos
   - Tests para autenticación y autorización

## 📚 Próximos Pasos

1. **Ampliar Cobertura**:
   - Agregar tests para todos los módulos restantes
   - Agregar tests para middleware
   - Agregar tests para utilidades

2. **Tests de Rendimiento**:
   - Agregar tests de carga
   - Agregar tests de tiempo de respuesta

3. **Tests de Integración Completa**:
   - Tests de flujos completos (end-to-end)
   - Tests de integración con servicios externos

4. **CI/CD**:
   - Configurar tests en CI/CD
   - Configurar reportes de cobertura automáticos

## 🐛 Problemas Conocidos

1. **Windows**: Se requiere `cross-env` para establecer variables de entorno
2. **Base de Datos**: Requiere MongoDB ejecutándose localmente o URI de MongoDB Atlas
3. **Sesiones**: En modo test, las sesiones no se almacenan en MongoDB

## 📖 Referencias

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Jest ESM Support](https://jestjs.io/docs/ecmascript-modules)

