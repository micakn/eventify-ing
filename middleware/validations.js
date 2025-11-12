// middleware/validations.js
// -------------------- VALIDACIONES CON EXPRESS-VALIDATOR --------------------
import { body, param, query, validationResult } from 'express-validator';
import {
  ROLES_ARRAY,
  AREAS_ARRAY,
  ESTADOS_TAREA_ARRAY,
  PRIORIDADES_ARRAY,
  TIPOS_TAREAS_POR_AREA,
  EMAIL_REGEX,
  TELEFONO_REGEX
} from '../config/constants.js';
import mongoose from 'mongoose';

/**
 * Middleware para verificar los resultados de la validación
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: errors.array().map(err => ({
        campo: err.path || err.param,
        mensaje: err.msg,
        valor: err.value
      }))
    });
  }
  next();
};

// -------------------- VALIDACIONES DE CLIENTE --------------------
export const validateCliente = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .matches(EMAIL_REGEX).withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .trim()
    .matches(TELEFONO_REGEX).withMessage('El teléfono no tiene un formato válido'),
  
  body('empresa')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El nombre de la empresa no puede exceder 100 caracteres'),
  
  body('notas')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres'),
  
  validate
];

// -------------------- VALIDACIONES DE EMPLEADO --------------------
export const validateEmpleado = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(ROLES_ARRAY).withMessage(`El rol debe ser uno de: ${ROLES_ARRAY.join(', ')}`),
  
  body('area')
    .notEmpty().withMessage('El área es obligatoria')
    .isIn(AREAS_ARRAY).withMessage(`El área debe ser una de: ${AREAS_ARRAY.join(', ')}`),
  
  body('email')
    .optional()
    .trim()
    .matches(EMAIL_REGEX).withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .trim()
    .matches(TELEFONO_REGEX).withMessage('El teléfono no tiene un formato válido'),
  
  validate
];

// -------------------- VALIDACIONES DE EVENTO --------------------
export const validateEvento = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del evento es obligatorio')
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('lugar')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('El lugar no puede exceder 200 caracteres'),
  
  body('fechaInicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('La fecha de inicio debe tener formato ISO 8601 (YYYY-MM-DD)')
    .toDate(),
  
  body('fechaFin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('La fecha de fin debe tener formato ISO 8601 (YYYY-MM-DD)')
    .toDate()
    .custom((fechaFin, { req }) => {
      const fechaInicio = req.body.fechaInicio ? new Date(req.body.fechaInicio) : null;
      if (fechaInicio && new Date(fechaFin) < fechaInicio) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  
  body('presupuesto')
    .optional()
    .isFloat({ min: 0 }).withMessage('El presupuesto debe ser un número positivo')
    .toFloat(),
  
  body('estado')
    .optional()
    .isIn(['planificacion', 'en_curso', 'ejecutado', 'cerrado', 'cancelado']).withMessage('Estado inválido'),
  
  body('responsables')
    .optional()
    .isArray().withMessage('Los responsables deben ser un array')
    .custom((responsables) => {
      if (responsables && responsables.some(id => !mongoose.isValidObjectId(id))) {
        throw new Error('Uno o más IDs de responsables son inválidos');
      }
      return true;
    }),
  
  body('cliente')
    .optional()
    .custom((id) => {
      if (id && !mongoose.isValidObjectId(id)) {
        throw new Error('ID de cliente inválido');
      }
      return true;
    }),
  
  validate
];

// -------------------- VALIDACIONES DE TAREA --------------------
export const validateTarea = [
  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('estado')
    .optional()
    .isIn(ESTADOS_TAREA_ARRAY).withMessage(`El estado debe ser uno de: ${ESTADOS_TAREA_ARRAY.join(', ')}`),
  
  body('prioridad')
    .optional()
    .isIn(PRIORIDADES_ARRAY).withMessage(`La prioridad debe ser una de: ${PRIORIDADES_ARRAY.join(', ')}`),
  
  body('area')
    .notEmpty().withMessage('El área es obligatoria')
    .isIn(AREAS_ARRAY.filter(a => a !== 'Atención al Cliente')).withMessage('El área no es válida para tareas'),
  
  body('tipo')
    .notEmpty().withMessage('El tipo de tarea es obligatorio')
    .custom((tipo, { req }) => {
      const area = req.body.area;
      if (!area) return true; // Se validará en el campo area
      
      const tiposValidos = TIPOS_TAREAS_POR_AREA[area];
      if (!tiposValidos || !tiposValidos.includes(tipo)) {
        throw new Error(`El tipo "${tipo}" no es válido para el área "${area}"`);
      }
      return true;
    }),
  
  body('empleadoAsignado')
    .optional()
    .custom((id) => {
      if (id && !mongoose.isValidObjectId(id)) {
        throw new Error('El ID del empleado asignado no es válido');
      }
      return true;
    }),
  
  body('eventoAsignado')
    .optional()
    .custom((id) => {
      if (id && !mongoose.isValidObjectId(id)) {
        throw new Error('El ID del evento asignado no es válido');
      }
      return true;
    }),
  
  body('horasEstimadas')
    .optional()
    .isInt({ min: 0 }).withMessage('Las horas estimadas deben ser un número entero positivo')
    .toInt(),
  
  body('horasReales')
    .optional()
    .isInt({ min: 0 }).withMessage('Las horas reales deben ser un número entero positivo')
    .toInt(),
  
  body('fechaInicio')
    .optional()
    .isISO8601().withMessage('La fecha de inicio debe tener formato ISO 8601')
    .toDate(),
  
  body('fechaFin')
    .optional()
    .isISO8601().withMessage('La fecha de fin debe tener formato ISO 8601')
    .toDate()
    .custom((fechaFin, { req }) => {
      const fechaInicio = req.body.fechaInicio ? new Date(req.body.fechaInicio) : null;
      if (fechaInicio && new Date(fechaFin) < fechaInicio) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  
  validate
];

// -------------------- VALIDACIONES DE PARÁMETROS --------------------
export const validateIdParam = [
  param('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('El ID proporcionado no es válido');
      }
      return true;
    }),
  validate
];

