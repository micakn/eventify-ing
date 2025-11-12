// config/constants.js
// -------------------- CONSTANTES DEL SISTEMA --------------------

export const ROLES = {
  ADMINISTRADOR: 'administrador',
  PLANNER: 'planner',
  COORDINADOR: 'coordinador'
};

export const AREAS = {
  PRODUCCION_LOGISTICA: 'Producción y Logística',
  PLANIFICACION_FINANZAS: 'Planificación y Finanzas',
  ATENCION_CLIENTE: 'Atención al Cliente',
  ADMINISTRACION: 'Administración'
};

export const ESTADOS_TAREA = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en proceso',
  FINALIZADA: 'finalizada'
};

export const PRIORIDADES = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta'
};

// Tipos de tareas por área
export const TIPOS_TAREAS_POR_AREA = {
  [AREAS.PRODUCCION_LOGISTICA]: [
    'Coordinación con proveedores',
    'Montaje de escenario o mobiliario',
    'Verificación técnica previa al evento'
  ],
  [AREAS.PLANIFICACION_FINANZAS]: [
    'Carga y control del presupuesto del evento',
    'Firma de contratos con clientes/proveedores',
    'Seguimiento del cronograma y fechas clave'
  ],
  [AREAS.ADMINISTRACION]: [
    'Gestión de usuarios del sistema',
    'Control de permisos y accesos'
  ]
};

// Arrays para validaciones
export const ROLES_ARRAY = Object.values(ROLES);
export const AREAS_ARRAY = Object.values(AREAS);
export const ESTADOS_TAREA_ARRAY = Object.values(ESTADOS_TAREA);
export const PRIORIDADES_ARRAY = Object.values(PRIORIDADES);

// Validaciones de formato
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TELEFONO_REGEX = /^[\d\s\-\+\(\)]+$/;

// Categorías de items de cotización
export const CATEGORIAS_ITEMS = {
  CATERING: 'Catering',
  SONIDO: 'Sonido',
  ILUMINACION: 'Iluminación',
  DECORACION: 'Decoración',
  LOGISTICA: 'Logística',
  OTROS: 'Otros'
};

export const CATEGORIAS_ITEMS_ARRAY = Object.values(CATEGORIAS_ITEMS);

// Condiciones impositivas
export const CONDICIONES_IMPOSITIVAS = {
  RESPONSABLE_INSCRIPTO: 'Responsable Inscripto',
  MONOTRIBUTO: 'Monotributo',
  EXENTO: 'Exento',
  NO_RESPONSABLE: 'No Responsable'
};

export const CONDICIONES_IMPOSITIVAS_ARRAY = Object.values(CONDICIONES_IMPOSITIVAS);

// Estados de cotización
export const ESTADOS_COTIZACION = {
  BORRADOR: 'borrador',
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  VENCIDA: 'vencida'
};

export const ESTADOS_COTIZACION_ARRAY = Object.values(ESTADOS_COTIZACION);

// Estados de evento
export const ESTADOS_EVENTO = {
  PLANIFICACION: 'planificacion',
  EN_CURSO: 'en_curso',
  EJECUTADO: 'ejecutado',
  CERRADO: 'cerrado',
  CANCELADO: 'cancelado'
};

export const ESTADOS_EVENTO_ARRAY = Object.values(ESTADOS_EVENTO);

// Estados de hito
export const ESTADOS_HITO = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado',
  ATRASADO: 'atrasado',
  CANCELADO: 'cancelado'
};

export const ESTADOS_HITO_ARRAY = Object.values(ESTADOS_HITO);

// Tipos de hito
export const TIPOS_HITO = {
  REUNION: 'reunion',
  TAREA: 'tarea',
  HITO: 'hito',
  REVISION: 'revision',
  ENTREGA: 'entrega'
};

export const TIPOS_HITO_ARRAY = Object.values(TIPOS_HITO);

// Prioridades de hito
export const PRIORIDADES_HITO = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica'
};

export const PRIORIDADES_HITO_ARRAY = Object.values(PRIORIDADES_HITO);

// Estados de gasto
export const ESTADOS_GASTO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  CANCELADO: 'cancelado',
  VENCIDO: 'vencido'
};

export const ESTADOS_GASTO_ARRAY = Object.values(ESTADOS_GASTO);

// Métodos de pago
export const METODOS_PAGO = {
  TRANSFERENCIA: 'transferencia',
  CHEQUE: 'cheque',
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
  OTRO: 'otro'
};

export const METODOS_PAGO_ARRAY = Object.values(METODOS_PAGO);

// Estados de factura
export const ESTADOS_FACTURA = {
  BORRADOR: 'borrador',
  PENDIENTE: 'pendiente',
  ENVIADA: 'enviada',
  PAGADA: 'pagada',
  VENCIDA: 'vencida',
  CANCELADA: 'cancelada'
};

export const ESTADOS_FACTURA_ARRAY = Object.values(ESTADOS_FACTURA);

// Categorías de gastos/facturas (igual que items de cotización)
export const CATEGORIAS_GASTO = CATEGORIAS_ITEMS;
export const CATEGORIAS_GASTO_ARRAY = CATEGORIAS_ITEMS_ARRAY;

// Acciones de auditoría
export const ACCIONES_AUDITORIA = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  VIEW: 'view',
  EXPORT: 'export',
  LOGIN: 'login',
  LOGOUT: 'logout'
};

export const ACCIONES_AUDITORIA_ARRAY = Object.values(ACCIONES_AUDITORIA);

// Resultados de auditoría
export const RESULTADOS_AUDITORIA = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

export const RESULTADOS_AUDITORIA_ARRAY = Object.values(RESULTADOS_AUDITORIA);

