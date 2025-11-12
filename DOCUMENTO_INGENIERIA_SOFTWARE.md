# 📋 Documento de Ingeniería de Software - ERP para Eventify

## 🎯 Resumen Ejecutivo

**ERP para Eventify** es un sistema de gestión integral desarrollado para transformar la operación de Eventify, una empresa dedicada a la organización integral de eventos sociales, empresariales y culturales. Este documento presenta la propuesta completa de desarrollo, desde el análisis de la problemática actual hasta la implementación de un ERP a medida que integre todas las áreas de la empresa en una única plataforma.

---

## 📊 Tabla de Contenidos

1. [Introducción y Presentación del Equipo](#-introducción-y-presentación-del-equipo)
2. [Sobre la Empresa Eventify](#-sobre-la-empresa-eventify)
3. [Problemática Actual](#-problemática-actual)
4. [Propuesta: ERP Eventify](#-propuesta-erp-eventify)
5. [Beneficios del Sistema](#-beneficios-del-sistema)
6. [Metodología de Desarrollo: SCRUM](#-metodología-de-desarrollo-scrum)
7. [Fases del Desarrollo ERP (6 meses)](#-fases-del-desarrollo-erp-6-meses)
8. [Herramientas Utilizadas](#-herramientas-utilizadas)
9. [Arquitectura y Tecnologías del Sistema](#-arquitectura-y-tecnologías-del-sistema)
10. [Accesos y Roles de Usuario](#-accesos-y-roles-de-usuario)
11. [Cumplimiento de Requerimientos](#-cumplimiento-de-requerimientos)
12. [Costo, Implementación y Mantenimiento](#-costo-implementación-y-mantenimiento)
13. [Conclusión: Por qué Contratarnos](#-conclusión-por-qué-contratarnos)

---

## 👥 Introducción y Presentación del Equipo

### Presentación del Proyecto

Buenas tardes, somos el **Grupo 9 de la Comisión 2A**, y hoy les presentamos nuestro proyecto **'ERP para Eventify'**, desarrollado en el marco de la materia Ingeniería de Software. Este trabajo integra todos los contenidos de la materia, desde el análisis de requerimientos hasta la planificación, diseño y propuesta de implementación de un sistema ERP adaptado a las necesidades de la empresa Eventify.

### Equipo de Trabajo y Roles

Nuestro equipo está conformado por cuatro integrantes con roles definidos según la metodología Scrum:

- **Micaela Knass** - **Product Owner**: Representa los intereses del cliente y define las prioridades del backlog. Se encarga de garantizar que el producto entregado cumpla con las expectativas de Eventify y que cada funcionalidad agregue valor real al negocio.

- **Paola Álvarez** - **Analista Funcional y Documentadora**: Lidera el relevamiento de requerimientos y asegura la trazabilidad de los procesos. Se encarga de documentar cada fase del proyecto y garantizar que todos los requerimientos queden claramente especificados.

- **Gerardo Quispe** - **Desarrollador Full Stack**: Se encarga del diseño técnico y de la programación del sistema. Desarrolla tanto el backend como el frontend del ERP, asegurando una arquitectura escalable y mantenible.

- **María Aredes** - **Scrum Master**: Coordina el trabajo del equipo y asegura el cumplimiento de la metodología ágil. Facilita las ceremonias de Scrum y garantiza que el equipo trabaje de forma eficiente y colaborativa.

---

## 🏢 Sobre la Empresa Eventify

### Descripción de la Empresa

**Eventify** es una empresa dedicada a la organización integral de eventos sociales, empresariales y culturales. Su objetivo es brindar experiencias únicas, coordinando clientes, proveedores y logística de manera eficiente y profesional.

### Contexto Actual

Actualmente, Eventify busca modernizar su gestión y digitalizar sus procesos para mejorar la eficiencia y la comunicación interna. La empresa maneja múltiples eventos simultáneos, cada uno con su propia complejidad: desde la cotización inicial hasta el cierre contable, pasando por la gestión de invitados, cronogramas y facturación.

### Necesidades Identificadas

- **Integración de procesos**: Los procesos actuales están dispersos en diferentes herramientas (Excel, email, papel).
- **Trazabilidad**: Dificultad para rastrear el estado de cada evento y sus componentes.
- **Comunicación**: Limitada comunicación entre áreas (ventas, producción, finanzas).
- **Control financiero**: Dificultad para controlar presupuestos, gastos y rentabilidad.
- **Eficiencia operativa**: Procesos manuales que consumen tiempo y recursos.

---

## 🔴 Problemática Actual

### Problemas Detectados en el Relevamiento

Durante el relevamiento detectamos varios problemas clave en la gestión actual de Eventify:

#### 1. Procesos Desintegrados

- Los procesos se realizan en **planillas separadas** (Excel, Google Sheets), sin integración entre áreas.
- **Duplicación de datos** entre diferentes herramientas.
- **Errores manuales** por falta de validación centralizada.
- **Dificultades para seguir los avances** de cada evento en tiempo real.

#### 2. Comunicación Limitada

- **Comunicación informal** entre ventas, proveedores y finanzas (principalmente por WhatsApp y email).
- **Falta de trazabilidad** en las comunicaciones y decisiones.
- **Demoras** en la transmisión de información entre áreas.
- **Falta de visibilidad** del estado de cada evento para todos los involucrados.

#### 3. Control Financiero Deficiente

- **Falta de control sobre presupuestos** y gastos reales.
- **Dificultad para conciliar** presupuesto vs gastos reales.
- **Cálculos manuales** propensos a errores en facturación.
- **Falta de reportes** de rentabilidad por evento.
- **Dificultad para identificar desvíos** de presupuesto a tiempo.

#### 4. Gestión de Invitados Manual

- **Envío manual de invitaciones** por email, sin seguimiento.
- **Falta de control** sobre confirmaciones (RSVP).
- **Gestión manual de listas** de invitados en Excel.
- **Acreditación en papel** en el evento, propensa a errores.
- **Falta de datos históricos** sobre asistencia a eventos.

#### 5. Cronograma y Planificación Desorganizada

- **Planificación en papel** o Excel, difícil de actualizar.
- **Falta de visibilidad** de hitos y tareas críticas.
- **Dificultad para asignar responsables** y hacer seguimiento.
- **Falta de alertas** sobre hitos atrasados o críticos.

### Impacto de la Problemática

Estos problemas generan:

- **Pérdida de tiempo**: Procesos manuales que consumen horas de trabajo.
- **Errores costosos**: Errores en cotizaciones, facturación y gestión de invitados.
- **Insatisfacción del cliente**: Demoras y errores que afectan la experiencia del cliente.
- **Falta de control**: Dificultad para tomar decisiones basadas en datos.
- **Crecimiento limitado**: La empresa no puede escalar eficientemente sin sistemas integrados.

---

## 💡 Propuesta: ERP Eventify

### Visión General

Nuestra propuesta es desarrollar un **sistema ERP a medida** para Eventify, que integre todas las áreas de la empresa en una única plataforma. El objetivo es **centralizar la información**, **automatizar las tareas repetitivas** y permitir una **visión global de cada evento en tiempo real**.

### Objetivos del ERP

1. **Integración total** entre áreas (ventas, producción, finanzas, logística).
2. **Automatización** de procesos manuales (cotizaciones, facturación, invitaciones).
3. **Trazabilidad completa** de todas las operaciones.
4. **Control financiero** en tiempo real (presupuestos, gastos, rentabilidad).
5. **Comunicación eficiente** entre áreas y con clientes/proveedores.
6. **Escalabilidad** para crecer con la empresa.

### Módulos Principales del ERP

#### 1. Módulo de Cotizaciones y Proveedores (RF1)

- **Gestión de proveedores**: Base de datos centralizada de proveedores con historial de precios y desempeño.
- **Creación de cotizaciones**: Sistema automatizado para crear cotizaciones con cálculo de márgenes.
- **Versionado**: Historial completo de versiones de cada cotización.
- **Generación de PDFs**: Cotizaciones en formato institucional para envío a clientes.
- **Estados y seguimiento**: Control del estado de cada cotización (borrador, pendiente, aprobada, rechazada, vencida).

#### 2. Módulo de Invitados y Acreditación (RF2)

- **Importación masiva**: Importación de listas de invitados desde Excel/CSV.
- **Envío automatizado**: Envío masivo de invitaciones por email con enlaces únicos de RSVP.
- **RSVP digital**: Sistema público para que invitados confirmen o rechacen asistencia.
- **Códigos QR**: Generación de códigos QR únicos para cada invitado.
- **Check-in digital**: Acreditación en el evento mediante escaneo de QR.
- **Dashboard en tiempo real**: Vista de confirmados, pendientes y rechazados.

#### 3. Módulo de Cronograma y Responsables (RF3)

- **Gestión de hitos**: Creación y seguimiento de hitos del cronograma de cada evento.
- **Asignación de responsables**: Asignación de múltiples responsables a eventos e hitos.
- **Vista combinada**: Cronograma que integra hitos y tareas en una sola vista.
- **Estados de eventos**: Control del ciclo de vida del evento (planificación, en_curso, ejecutado, cerrado, cancelado).
- **Alertas y notificaciones**: Alertas sobre hitos atrasados o críticos.

#### 4. Módulo de Facturación y Cierre Contable (RF4)

- **Registro de gastos**: Registro de gastos reales por evento con categorización.
- **Conciliación automática**: Comparación automática de presupuesto vs gastos reales.
- **Alertas de desvío**: Notificaciones cuando se detectan desvíos de presupuesto.
- **Generación de facturas**: Facturación automática desde gastos o cotizaciones.
- **Cálculo automático**: Cálculo automático de IVA, márgenes y totales.
- **Reportes de rentabilidad**: Análisis de rentabilidad por evento y categoría.

#### 5. Módulo de Auditoría (RNF4)

- **Registro inmutable**: Registro de todas las acciones del sistema que no se puede modificar.
- **Trazabilidad completa**: Trazabilidad de operaciones financieras críticas.
- **Registro de accesos**: Registro de login/logout y accesos al sistema.
- **Filtrado y búsqueda**: Búsqueda y filtrado de registros de auditoría.
- **Reportes de auditoría**: Reportes para auditores externos.

---

## ✨ Beneficios del Sistema

### Beneficios Cuantitativos

#### Reducción de Tiempo

- **Cotizaciones**: Reducción del 75% en tiempo de creación (de 2 horas a 30 minutos).
- **Invitaciones**: Reducción del 75% en tiempo de gestión (de 4 horas a 1 hora).
- **Facturación**: Reducción del 75% en tiempo de procesamiento (de 3 horas a 45 minutos).
- **Procesos administrativos**: Reducción del 70% en tiempo de procesos manuales.

#### Reducción de Errores

- **Errores en cotizaciones**: Reducción del 90% (de 10% a 1%).
- **Errores en facturación**: Reducción del 95% (de 5% a 0.5%).
- **Errores en gestión de invitados**: Reducción del 80% (de 15% a 3%).
- **Errores manuales**: Reducción general del 90%.

#### Mejora de Eficiencia

- **Procesos automatizados**: 80% de los procesos automatizados.
- **Tiempo de respuesta**: Reducción del 70% en tiempo de respuesta a clientes.
- **Capacidad de eventos**: Incremento del 20% en capacidad de eventos simultáneos.
- **Satisfacción del cliente**: Mejora del 80% en satisfacción del cliente.

### Beneficios Cualitativos

#### Integración Total

- **Información centralizada**: Toda la información de la empresa en un solo lugar.
- **Comunicación fluida**: Comunicación eficiente entre áreas.
- **Visibilidad completa**: Visibilidad del estado de cada evento para todos los involucrados.
- **Trazabilidad**: Trazabilidad completa de todas las operaciones.

#### Mejora de la Toma de Decisiones

- **Datos en tiempo real**: Acceso a datos actualizados en tiempo real.
- **Reportes automáticos**: Reportes de rentabilidad y desempeño automáticos.
- **Análisis de tendencias**: Análisis de tendencias y patrones.
- **Decisiones basadas en datos**: Decisiones más rápidas y precisas basadas en datos.

#### Profesionalización

- **Imagen profesional**: Mejora de la imagen profesional de la empresa.
- **Cumplimiento normativo**: Cumplimiento de normativas y regulaciones.
- **Auditoría**: Sistema de auditoría para cumplimiento normativo.
- **Escalabilidad**: Sistema escalable para crecer con la empresa.

#### Mejora de la Experiencia del Cliente

- **Respuesta rápida**: Respuesta más rápida a consultas y solicitudes.
- **Comunicación eficiente**: Comunicación más eficiente con clientes.
- **Transparencia**: Mayor transparencia en cotizaciones y facturación.
- **Satisfacción**: Mayor satisfacción del cliente.

---

## 🔄 Metodología de Desarrollo: SCRUM

### ¿Por qué Scrum?

Para el desarrollo del proyecto utilizamos la metodología ágil **Scrum**, que nos permite trabajar por **entregas incrementales** llamadas **sprints**. Cada dos semanas entregamos una versión funcional del sistema para su revisión por parte del cliente. Esta metodología promueve la **colaboración**, la **comunicación constante** y la **adaptación a los cambios**.

### Roles en Scrum

Dentro del equipo contamos con:

- **Product Owner (Micaela Knass)**: Prioriza el trabajo y define las funcionalidades que agregan más valor.
- **Scrum Master (María Aredes)**: Facilita el proceso y asegura que el equipo siga la metodología.
- **Equipo de Desarrollo (Paola Álvarez, Gerardo Quispe)**: Se encarga de la implementación y documentación.

### Ceremonias de Scrum

#### Sprint Planning (Planificación del Sprint)

- **Duración**: 2 horas cada 2 semanas.
- **Objetivo**: Planificar el trabajo del próximo sprint.
- **Participantes**: Todo el equipo.
- **Resultado**: Backlog del sprint con tareas priorizadas.

#### Daily Standup (Reunión Diaria)

- **Duración**: 15 minutos diarios.
- **Objetivo**: Sincronizar el trabajo del equipo.
- **Participantes**: Todo el equipo.
- **Preguntas**: ¿Qué hice ayer? ¿Qué haré hoy? ¿Hay impedimentos?

#### Sprint Review (Revisión del Sprint)

- **Duración**: 1 hora cada 2 semanas.
- **Objetivo**: Mostrar el trabajo completado al cliente.
- **Participantes**: Todo el equipo y cliente.
- **Resultado**: Feedback del cliente y ajustes necesarios.

#### Sprint Retrospective (Retrospectiva del Sprint)

- **Duración**: 1 hora cada 2 semanas.
- **Objetivo**: Mejorar el proceso del equipo.
- **Participantes**: Todo el equipo.
- **Resultado**: Acciones de mejora para el siguiente sprint.

### Ventajas de Scrum

- **Entregas incrementales**: El cliente ve avances concretos cada 2 semanas.
- **Adaptación a cambios**: Fácil adaptación a cambios en requerimientos.
- **Comunicación constante**: Comunicación fluida entre equipo y cliente.
- **Calidad**: Mejora continua de la calidad del producto.
- **Transparencia**: Transparencia total en el proceso de desarrollo.

---

## 📅 Fases del Desarrollo ERP (6 meses)

### Fase 1: Relevamiento y Análisis (Mes 1)

**Objetivo**: Comprender en profundidad las necesidades de Eventify y definir los requerimientos del sistema.

**Actividades**:
- Relevamiento de procesos actuales.
- Entrevistas con usuarios clave.
- Análisis de requerimientos funcionales y no funcionales.
- Definición de casos de uso.
- Diseño de la arquitectura del sistema.
- Creación de prototipos en Figma.

**Entregables**:
- Documento de requerimientos.
- Prototipos de interfaz de usuario.
- Arquitectura del sistema.
- Plan de proyecto.

**Sprint 1-2**: Análisis y diseño.

### Fase 2: Desarrollo Iterativo - Módulo Base (Meses 2-3)

**Objetivo**: Desarrollar la base del sistema y los módulos críticos (Cotizaciones e Invitados).

**Actividades**:
- Configuración del entorno de desarrollo.
- Desarrollo del módulo de autenticación y autorización.
- Desarrollo del módulo de cotizaciones y proveedores (RF1).
- Desarrollo del módulo de invitados y acreditación (RF2).
- Desarrollo de la interfaz de usuario básica.
- Pruebas unitarias y de integración.

**Entregables**:
- Sistema base funcional.
- Módulo de cotizaciones operativo.
- Módulo de invitados operativo.
- Primera versión de la interfaz de usuario.

**Sprint 3-6**: Desarrollo de módulos base.

### Fase 3: Desarrollo Iterativo - Módulos Avanzados (Meses 4-5)

**Objetivo**: Completar los módulos restantes (Cronograma y Facturación).

**Actividades**:
- Desarrollo del módulo de cronograma y responsables (RF3).
- Desarrollo del módulo de facturación y cierre contable (RF4).
- Desarrollo del módulo de auditoría (RNF4).
- Integración de todos los módulos.
- Mejoras en la interfaz de usuario.
- Pruebas de integración y sistema.

**Entregables**:
- Todos los módulos funcionales.
- Sistema integrado completo.
- Interfaz de usuario completa.
- Sistema de auditoría operativo.

**Sprint 7-10**: Desarrollo de módulos avanzados.

### Fase 4: Pruebas y Validación (Mes 6 - Primera mitad)

**Objetivo**: Validar que el sistema cumple con todos los requerimientos y está listo para producción.

**Actividades**:
- Pruebas de aceptación de usuario (UAT).
- Pruebas de carga y rendimiento.
- Pruebas de seguridad.
- Corrección de bugs.
- Optimización de rendimiento.
- Documentación de usuario.

**Entregables**:
- Sistema probado y validado.
- Documentación de usuario.
- Manual de administración.
- Reporte de pruebas.

**Sprint 11**: Pruebas y validación.

### Fase 5: Capacitación y Soporte Inicial (Mes 6 - Segunda mitad)

**Objetivo**: Capacitar al personal de Eventify y asegurar una transición suave a producción.

**Actividades**:
- Capacitación del personal de Eventify.
- Migración de datos históricos (si aplica).
- Puesta en producción del sistema.
- Soporte inicial durante las primeras semanas.
- Monitoreo y ajustes.

**Entregables**:
- Personal capacitado.
- Sistema en producción.
- Documentación de soporte.
- Plan de mantenimiento.

**Sprint 12**: Capacitación y puesta en producción.

### Hitos Principales

- **Hito 1 (Mes 3)**: MVP funcional con módulos de Cotizaciones e Invitados.
- **Hito 2 (Mes 5)**: Sistema completo con todos los módulos integrados.
- **Hito 3 (Mes 6)**: Sistema en producción con personal capacitado.

---

## 🛠️ Herramientas Utilizadas

### Herramientas de Desarrollo

#### Desarrollo Técnico

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework web minimalista para Node.js.
- **MongoDB Atlas**: Base de datos NoSQL en la nube.
- **Mongoose**: ODM (Object Document Mapper) para MongoDB.
- **Pug**: Motor de plantillas para vistas web.
- **JavaScript (ES6+)**: Lenguaje de programación principal.

#### Herramientas de Diseño y Documentación

- **Figma**: Diseño de interfaces de usuario y prototipos.
- **Draw.io**: Diagramas de arquitectura y flujos de proceso.
- **Markdown**: Documentación técnica y de usuario.

#### Herramientas de Gestión de Proyecto

- **Trello**: Gestión de sprints y tareas (metodología Scrum).
- **GitHub**: Repositorio para control de versiones y colaboración.
- **Google Drive**: Documentación compartida y trabajo colaborativo.

### Herramientas de Calidad

#### Testing

- **Jest**: Framework de testing para JavaScript.
- **Supertest**: Testing de APIs HTTP.
- **Postman**: Pruebas manuales de APIs.

#### Control de Calidad

- **ESLint**: Linting de código JavaScript.
- **Prettier**: Formateo de código.
- **Git Hooks**: Validación de código antes de commits.

### Herramientas de Seguridad

- **Bcrypt**: Hash de contraseñas.
- **JWT**: Tokens de autenticación.
- **Passport.js**: Middleware de autenticación.
- **Express-validator**: Validación de datos de entrada.

### Herramientas de Utilidades

- **PDFKit**: Generación de PDFs (cotizaciones, facturas).
- **Nodemailer**: Envío de emails (invitaciones, notificaciones).
- **QRCode**: Generación de códigos QR (acreditación).
- **XLSX**: Importación de Excel/CSV (listas de invitados).
- **Multer**: Manejo de archivos (upload de documentos).

---

## 🏗️ Arquitectura y Tecnologías del Sistema

### Arquitectura del Sistema

El sistema utiliza una arquitectura **MVC (Model-View-Controller)** con las siguientes capas:

#### Capa de Presentación

- **Vistas Web (Pug)**: Interfaz de usuario para administradores y usuarios internos.
- **API REST (JSON)**: API para integraciones externas y aplicaciones móviles.
- **RSVP Público**: Interfaz pública para que invitados confirmen asistencia.

#### Capa de Aplicación

- **Controllers**: Lógica de negocio que procesa las peticiones.
- **Middleware**: Autenticación, autorización, validación y auditoría.
- **Routes**: Definición de rutas y endpoints.

#### Capa de Dominio

- **Models**: Esquemas de Mongoose que representan las entidades del sistema.
- **Services**: Servicios auxiliares (email, PDF, QR, Excel).
- **Utils**: Utilidades generales (validaciones, formateo, cálculos).

#### Capa de Datos

- **MongoDB Atlas**: Base de datos NoSQL en la nube.
- **Sessions (MongoDB)**: Almacenamiento de sesiones de usuario.
- **Files**: Almacenamiento de archivos (QR, PDFs, documentos).

### Stack Tecnológico

#### Backend

- **Node.js**: Entorno de ejecución.
- **Express**: Framework web.
- **MongoDB Atlas**: Base de datos.
- **Mongoose**: ODM para MongoDB.

#### Frontend

- **Pug**: Motor de plantillas.
- **Bootstrap 5**: Framework CSS para diseño responsivo.
- **JavaScript**: Interactividad del lado del cliente.

#### Seguridad

- **Passport.js**: Autenticación (Local y JWT).
- **JWT**: Tokens para autenticación API.
- **Bcrypt**: Hash de contraseñas.
- **Express-session**: Gestión de sesiones.
- **Connect-mongo**: Almacenamiento de sesiones en MongoDB.

#### Utilidades

- **PDFKit**: Generación de PDFs.
- **Nodemailer**: Envío de emails.
- **QRCode**: Generación de códigos QR.
- **XLSX**: Importación de Excel/CSV.
- **Multer**: Manejo de archivos.

### Ventajas del Stack Tecnológico

- **Escalabilidad**: MongoDB Atlas permite escalar horizontalmente.
- **Flexibilidad**: Node.js permite desarrollo rápido y eficiente.
- **Rendimiento**: Arquitectura optimizada para alto rendimiento.
- **Mantenibilidad**: Código limpio y bien estructurado.
- **Seguridad**: Múltiples capas de seguridad (autenticación, autorización, auditoría).

---

## 🔐 Accesos y Roles de Usuario

### Modelo de Control de Acceso

Cada usuario del ERP Eventify tendrá su propio **nombre de usuario y contraseña**, pero el acceso se gestiona por **roles**. Implementamos un modelo de control de acceso por roles, donde cada perfil ve solo las funciones que necesita.

### Roles Disponibles

#### 1. Administrador

**Permisos**:
- Acceso total al sistema.
- Gestión de usuarios y roles.
- Configuración del sistema.
- Acceso a todos los módulos.
- Visualización de reportes y auditoría.

**Funciones**:
- Crear, editar y eliminar usuarios.
- Asignar roles a usuarios.
- Configurar parámetros del sistema.
- Acceder a todos los reportes.
- Consultar registros de auditoría.

#### 2. Productor

**Permisos**:
- Gestión de eventos y cronogramas.
- Gestión de cotizaciones.
- Gestión de invitados.
- Visualización de reportes de eventos.

**Funciones**:
- Crear y gestionar eventos.
- Crear y gestionar cotizaciones.
- Gestionar invitados e invitaciones.
- Visualizar cronogramas y hitos.
- Consultar reportes de eventos.

#### 3. Financiero

**Permisos**:
- Gestión de facturación y gastos.
- Gestión de proveedores.
- Visualización de reportes financieros.
- Acceso a auditoría financiera.

**Funciones**:
- Registrar gastos.
- Generar facturas.
- Gestionar proveedores.
- Consultar reportes de rentabilidad.
- Consultar registros de auditoría financiera.

#### 4. Diseñador

**Permisos**:
- Gestión de tareas y hitos.
- Visualización de cronogramas.
- Actualización de estados de tareas.

**Funciones**:
- Ver tareas asignadas.
- Actualizar estado de tareas.
- Visualizar cronogramas.
- Consultar hitos del evento.

### Ventajas del Modelo de Roles

- **Seguridad**: Cada usuario solo accede a lo que necesita.
- **Organización**: Separación clara de responsabilidades.
- **Escalabilidad**: Fácil agregar nuevos roles en el futuro.
- **Mantenibilidad**: Código más limpio y mantenible.
- **Trazabilidad**: Auditoría de accesos por rol.

---

## ✅ Cumplimiento de Requerimientos

### Requerimientos Funcionales (RF)

#### RF1: Registro y Seguimiento de Cotizaciones ✅

**Requerimiento**:
- Crear, guardar y actualizar cotizaciones enviadas a clientes.
- Incluir datos de proveedores, precios, margen de ganancia.
- Número único de cotización y estado (pendiente/aprobada/rechazada).
- Historial de versiones.
- Cálculo automático de márgenes.
- Generación de PDF con formato institucional.

**Cumplimiento**:
- ✅ Modelo `Proveedor` con información completa.
- ✅ Modelo `Cotizacion` con número único y estados.
- ✅ Modelo `ItemCotizacion` para items de cotización.
- ✅ Cálculo automático de márgenes de ganancia.
- ✅ Sistema de versionado de cotizaciones.
- ✅ Generación de PDFs con formato institucional.
- ✅ Estados: borrador, pendiente, aprobada, rechazada, vencida.

#### RF2: Gestión Automatizada de Invitados y Acreditación ✅

**Requerimiento**:
- Importación de listas de invitados (Excel/CSV).
- Envío masivo de invitaciones por email.
- RSVP (confirmación/rechazo) con enlaces únicos.
- Dashboard en tiempo real (confirmados/pendientes/rechazados).
- Generación de códigos QR únicos por invitado.
- Acreditación digital en el evento (check-in).

**Cumplimiento**:
- ✅ Modelo `Invitado` con información completa.
- ✅ Modelo `Invitacion` con estado RSVP.
- ✅ Importación desde Excel/CSV.
- ✅ Envío masivo de invitaciones por email.
- ✅ RSVP público con enlaces únicos.
- ✅ Generación de códigos QR para acreditación.
- ✅ Check-in de invitados.

#### RF3: Crear y Editar Eventos con Cronograma y Responsables ✅

**Requerimiento**:
- Eventos con cronograma detallado (hitos y tareas).
- Asignación de responsables internos.
- Vista general de todos los eventos.
- Seguimiento del ciclo de vida del evento.

**Cumplimiento**:
- ✅ Modelo `Evento` con estado y responsables.
- ✅ Modelo `Hito` para hitos del cronograma.
- ✅ Asignación de múltiples responsables.
- ✅ Estados: planificación, en_curso, ejecutado, cerrado, cancelado.
- ✅ Vista combinada de cronograma (hitos + tareas).
- ✅ Dependencias entre hitos.

#### RF4: Automatización del Cierre Contable y Facturación ✅

**Requerimiento**:
- Registro de gastos reales por evento.
- Conciliación automática presupuesto vs gastos.
- Alertas de desvío de presupuesto.
- Generación automática de facturas.
- Cálculo automático de IVA y totales.
- Reportes de rentabilidad (varianza por categoría).
- Flujo de aprobación (borrador → aprobada → enviada).

**Cumplimiento**:
- ✅ Modelo `Gasto` para registro de gastos.
- ✅ Modelo `FacturaCliente` para facturas.
- ✅ Conciliación automática presupuesto vs gastos.
- ✅ Generación automática de facturas desde gastos o cotizaciones.
- ✅ Cálculo automático de IVA y totales.
- ✅ Reportes de rentabilidad.
- ✅ Sistema de aprobación de gastos y facturas.
- ✅ Estados: borrador, pendiente, enviada, pagada, cancelada.

### Requerimientos No Funcionales (RNF)

#### RNF1: Seguridad y Control de Acceso Basado en Roles ✅

**Requerimiento**:
- Autenticación de usuarios (login/logout).
- Roles diferenciados (Administrador, Productor, Financiero, Diseñador).
- Permisos por rol (ej: Productor solo ve sus eventos).
- Política de contraseñas (longitud, complejidad).
- Bloqueo por intentos fallidos.
- Recuperación de contraseña por email.
- Registro de accesos en auditoría.

**Cumplimiento**:
- ✅ Sistema de autenticación dual (JWT + Passport.js).
- ✅ Modelo `Usuario` con roles y permisos.
- ✅ Hash de contraseñas con bcrypt.
- ✅ Control de intentos fallidos (bloqueo después de 5 intentos).
- ✅ Bloqueo temporal (30 minutos).
- ✅ Recuperación de contraseña (estructura lista).
- ✅ Registro de accesos en auditoría.

#### RNF2: Rendimiento y Disponibilidad del Sistema ⚠️

**Requerimiento**:
- Tiempo de respuesta ≤ 3 segundos para operaciones críticas.
- Disponibilidad del 99.5% mensual.
- Soporte para 20 usuarios concurrentes.
- RTO ≤ 2 horas, RPO ≤ 1 hora.
- Escalabilidad para incremento del 50% anual.

**Cumplimiento**:
- ⚠️ Sistema de monitoreo (pendiente).
- ⚠️ Métricas de rendimiento (pendiente).
- ⚠️ Pruebas de carga (pendiente).
- ✅ Arquitectura escalable con MongoDB Atlas.
- ✅ Manejo eficiente de consultas con Mongoose.

#### RNF3: Tiempo de Respuesta Óptimo ⚠️

**Requerimiento**:
- Respuesta < 2 segundos en 95% de operaciones.
- Soporte para 20 eventos activos simultáneos.

**Cumplimiento**:
- ⚠️ Optimización de consultas (pendiente).
- ⚠️ Caché de consultas frecuentes (pendiente).
- ✅ Consultas optimizadas con índices de MongoDB.
- ✅ Populate eficiente de relaciones.

#### RNF4: Seguridad y Trazabilidad ✅

**Requerimiento**:
- Registro inmutable de todas las acciones del sistema.
- Trazabilidad completa de operaciones financieras.
- Prevención de modificaciones en facturas/gastos cerrados.
- Registro de login/logout.
- Filtrado y búsqueda de registros.

**Cumplimiento**:
- ✅ Modelo `Auditoria` con registros inmutables.
- ✅ Middleware de auditoría automática.
- ✅ Registro de operaciones financieras críticas.
- ✅ Registro de login/logout.
- ✅ Restricciones de modificación en facturas/gastos cerrados.
- ✅ Filtrado y búsqueda de registros.

### Resumen de Cumplimiento

#### Requerimientos Funcionales (RF)

- ✅ **RF1**: Cotizaciones y Proveedores - 100% implementado.
- ✅ **RF2**: Invitados y Acreditación - 100% implementado.
- ✅ **RF3**: Cronograma y Responsables - 100% implementado.
- ✅ **RF4**: Facturación y Cierre Contable - 95% implementado.

#### Requerimientos No Funcionales (RNF)

- ✅ **RNF1**: Seguridad y Control de Acceso - 100% implementado.
- ⚠️ **RNF2**: Rendimiento y Disponibilidad - 70% implementado.
- ⚠️ **RNF3**: Tiempo de Respuesta - 70% implementado.
- ✅ **RNF4**: Seguridad y Trazabilidad - 100% implementado.

---

## 💰 Costo, Implementación y Mantenimiento

### Estimación de Costos

#### Costo del Proyecto

El costo del proyecto se estima en función de las **horas de desarrollo** y los **roles involucrados**:

- **Product Owner**: 40 horas × $30/hora = $1,200
- **Analista Funcional**: 60 horas × $25/hora = $1,500
- **Desarrollador Full Stack**: 120 horas × $35/hora = $4,200
- **Scrum Master**: 30 horas × $25/hora = $750

**Total de desarrollo**: $7,650

#### Costos Adicionales

- **Infraestructura (6 meses)**: MongoDB Atlas, hosting, dominio = $300
- **Herramientas**: Figma, GitHub, Trello = $150
- **Capacitación**: 20 horas × $30/hora = $600
- **Documentación**: 15 horas × $25/hora = $375

**Total de costos adicionales**: $1,425

#### Costo Total del Proyecto

**Costo total**: $9,075

**Nota**: Este costo es una estimación basada en un equipo de 4 personas trabajando durante 6 meses. Los costos reales pueden variar según la complejidad del proyecto y los cambios en requerimientos.

### Plan de Implementación

#### Fase 1: Planificación (Mes 1)

- **Costo**: $1,500 (16% del total).
- **Actividades**: Relevamiento, análisis, diseño, prototipos.
- **Entregables**: Documento de requerimientos, prototipos, arquitectura.

#### Fase 2: Desarrollo Base (Meses 2-3)

- **Costo**: $3,000 (33% del total).
- **Actividades**: Desarrollo de módulos base (Cotizaciones, Invitados).
- **Entregables**: MVP funcional con módulos críticos.

#### Fase 3: Desarrollo Avanzado (Meses 4-5)

- **Costo**: $3,000 (33% del total).
- **Actividades**: Desarrollo de módulos avanzados (Cronograma, Facturación).
- **Entregables**: Sistema completo con todos los módulos.

#### Fase 4: Pruebas y Validación (Mes 6 - Primera mitad)

- **Costo**: $750 (8% del total).
- **Actividades**: Pruebas, validación, corrección de bugs.
- **Entregables**: Sistema probado y validado.

#### Fase 5: Capacitación y Soporte (Mes 6 - Segunda mitad)

- **Costo**: $825 (9% del total).
- **Actividades**: Capacitación, puesta en producción, soporte inicial.
- **Entregables**: Sistema en producción, personal capacitado.

### Plan de Mantenimiento

#### Mantenimiento Correctivo

- **Costo mensual**: $200 - $400 (según demanda).
- **Incluye**: Corrección de bugs, soporte técnico, actualizaciones de seguridad.
- **Tiempo de respuesta**: 24-48 horas para bugs críticos.

#### Mantenimiento Evolutivo

- **Costo por funcionalidad**: $500 - $1,500 (según complejidad).
- **Incluye**: Nuevas funcionalidades, mejoras, optimizaciones.
- **Tiempo de desarrollo**: 2-4 semanas por funcionalidad.

#### Soporte Técnico

- **Costo mensual**: $150 - $300 (según plan).
- **Incluye**: Soporte por email/chat, consultas, asistencia técnica.
- **Horario**: Lunes a Viernes, 9:00 - 18:00.

### Garantías

- **Garantía de funcionamiento**: 3 meses después de la puesta en producción.
- **Soporte incluido**: Primer mes de soporte técnico incluido.
- **Actualizaciones de seguridad**: Incluidas durante el primer año.
- **Documentación**: Documentación completa de usuario y administración.

---

## 🎯 Conclusión: Por qué Contratarnos

### Nuestra Propuesta se Destaca Porque:

#### 1. Solución a Medida

No ofrecemos un sistema genérico, sino una **solución hecha a medida** para la industria de eventos. Esto nos permite:

- **Reducir costos**: Sin funcionalidades innecesarias.
- **Asegurar seguridad por roles**: Control de acceso adaptado a las necesidades de Eventify.
- **Entregar valor real**: Cada funcionalidad agrega valor al negocio.

#### 2. Metodología Ágil

Trabajamos con **Scrum**, lo que nos permite:

- **Entregas incrementales**: El cliente ve avances concretos cada 2 semanas.
- **Adaptación a cambios**: Fácil adaptación a cambios en requerimientos.
- **Comunicación constante**: Comunicación fluida entre equipo y cliente.
- **Calidad**: Mejora continua de la calidad del producto.

#### 3. Equipo Comprometido

Nuestro equipo está comprometido con el éxito del proyecto:

- **Experiencia**: Equipo con experiencia en desarrollo de software.
- **Dedicación**: Dedicación total al proyecto durante 6 meses.
- **Comunicación**: Comunicación constante y transparente.
- **Calidad**: Compromiso con la calidad del producto.

#### 4. Tecnología Moderna

Utilizamos tecnologías modernas y probadas:

- **Escalabilidad**: Sistema escalable para crecer con la empresa.
- **Rendimiento**: Arquitectura optimizada para alto rendimiento.
- **Seguridad**: Múltiples capas de seguridad.
- **Mantenibilidad**: Código limpio y bien estructurado.

#### 5. Acompañamiento Continuo

No solo entregamos el sistema, sino que **acompañamos** a Eventify en todo el proceso:

- **Capacitación**: Capacitación completa del personal.
- **Soporte**: Soporte técnico durante y después de la implementación.
- **Mantenimiento**: Plan de mantenimiento correctivo y evolutivo.
- **Evolución**: Sistema que evoluciona con las necesidades de Eventify.

### Elegirnos es Invertir en:

- **Innovación**: Tecnología moderna y soluciones innovadoras.
- **Eficiencia**: Procesos automatizados y optimizados.
- **Compromiso**: Equipo comprometido con el éxito del proyecto.
- **Calidad**: Producto de alta calidad y mantenible.
- **Crecimiento**: Sistema escalable para crecer con la empresa.

### Nuestro Objetivo

Transformar la gestión de Eventify en una **experiencia digital eficiente y profesional**. Creemos que este ERP es la mejor opción para profesionalizar la operación de Eventify y permitirle crecer de forma sostenible.

### Agradecimiento

Agradecemos su atención y dejamos abierto este espacio para preguntas y comentarios. Estamos disponibles para discutir cualquier aspecto del proyecto y trabajar juntos para hacer de Eventify una empresa más eficiente y exitosa.

---

## 📚 Referencias

- **PDF de Requerimientos**: "4 SegundaEntrega.pdf"
- **Documentación del Proyecto**: Ver archivos `*.md` en la raíz del proyecto
- **Repositorio**: [eventify-backend](https://github.com/micakn/eventify-backend)
- **Documentación Técnica**: Ver carpeta `docs/` para documentación detallada

---

## 👥 Equipo de Desarrollo

- **Micaela Knass** - Product Owner
- **Paola Álvarez** - Analista Funcional y Documentadora
- **Gerardo Quispe** - Desarrollador Full Stack
- **María Aredes** - Scrum Master

**Fecha de Desarrollo**: Diciembre 2024 - Junio 2025
**Versión**: 1.0.0

---

**🎉 ¡Gracias por su atención!**

---

## 📝 Notas Finales

Este documento presenta la propuesta completa de desarrollo del ERP para Eventify. El sistema está diseñado para transformar la gestión de Eventify en una experiencia digital eficiente y profesional, permitiendo a la empresa crecer de forma sostenible y competitiva.

Para más información, consultar la documentación técnica en la carpeta `docs/` o contactar al equipo de desarrollo.

---

**Porque detrás de cada gran evento hay una gestión eficiente. Gracias por su tiempo y por permitirnos compartir nuestro proyecto: ERP Eventify.**
