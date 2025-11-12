// routes/gastoRoutes.js
import express from 'express';
import gastoController from '../controllers/gastoController.js';
import { validateIdParam } from '../middleware/validations.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';
import mongoose from 'mongoose';
import { auditoriaFinanciera } from '../middleware/auditoria.js';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateGasto = [
  body('evento')
    .notEmpty().withMessage('El evento es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de evento inválido');
      }
      return true;
    }),
  
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 3, max: 500 }).withMessage('La descripción debe tener entre 3 y 500 caracteres'),
  
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isIn(['Catering', 'Sonido', 'Iluminación', 'Decoración', 'Logística', 'Otros']).withMessage('Categoría inválida'),
  
  body('monto')
    .notEmpty().withMessage('El monto es obligatorio')
    .isFloat({ min: 0 }).withMessage('El monto debe ser un número positivo')
    .toFloat(),
  
  body('iva')
    .optional()
    .isFloat({ min: 0 }).withMessage('El IVA debe ser un número positivo')
    .toFloat(),
  
  body('total')
    .optional()
    .isFloat({ min: 0 }).withMessage('El total debe ser un número positivo')
    .toFloat(),
  
  body('fecha')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido')
    .toDate(),
  
  body('estado')
    .optional()
    .isIn(['pendiente', 'pagado', 'cancelado', 'vencido']).withMessage('Estado inválido'),
  
  body('metodoPago')
    .optional()
    .isIn(['transferencia', 'cheque', 'efectivo', 'tarjeta', 'otro']).withMessage('Método de pago inválido'),
  
  body('proveedor')
    .optional()
    .custom((id) => {
      if (id && !mongoose.isValidObjectId(id)) {
        throw new Error('ID de proveedor inválido');
      }
      return true;
    }),
  
  body('cotizacion')
    .optional()
    .custom((id) => {
      if (id && !mongoose.isValidObjectId(id)) {
        throw new Error('ID de cotización inválido');
      }
      return true;
    }),
  
  validate
];

const validateAprobar = [
  body('empleadoId')
    .notEmpty().withMessage('El ID del empleado es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de empleado inválido');
      }
      return true;
    }),
  validate
];

// -------------------- RUTAS --------------------
router.get('/', gastoController.listGastos);
router.get('/evento/:eventoId', validateIdParam, gastoController.getGastosPorEvento);
router.get('/evento/:eventoId/resumen', validateIdParam, gastoController.getResumenPorEvento);
router.get('/:id', validateIdParam, gastoController.getGasto);
router.post('/', validateGasto, auditoriaFinanciera('Gasto', 'create'), gastoController.addGasto);
router.put('/:id', validateIdParam, validateGasto, auditoriaFinanciera('Gasto', 'update'), gastoController.updateGasto);
router.post('/:id/aprobar', validateIdParam, validateAprobar, auditoriaFinanciera('Gasto', 'approve'), gastoController.aprobarGasto);
router.delete('/:id', validateIdParam, auditoriaFinanciera('Gasto', 'delete'), gastoController.deleteGasto);

export default router;

