// routes/facturaRoutes.js
import express from 'express';
import facturaController from '../controllers/facturaController.js';
import { validateIdParam } from '../middleware/validations.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';
import mongoose from 'mongoose';
import { auditoriaFinanciera } from '../middleware/auditoria.js';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateFactura = [
  body('cliente')
    .notEmpty().withMessage('El cliente es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de cliente inválido');
      }
      return true;
    }),
  
  body('evento')
    .notEmpty().withMessage('El evento es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de evento inválido');
      }
      return true;
    }),
  
  body('margenPorcentaje')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El margen porcentual debe estar entre 0 y 100')
    .toFloat(),
  
  body('estado')
    .optional()
    .isIn(['borrador', 'pendiente', 'enviada', 'pagada', 'vencida', 'cancelada']).withMessage('Estado inválido'),
  
  body('metodoPago')
    .optional()
    .isIn(['transferencia', 'cheque', 'efectivo', 'tarjeta', 'otro']).withMessage('Método de pago inválido'),
  
  body('condicionImpositiva')
    .optional()
    .isIn(['Responsable Inscripto', 'Monotributo', 'Exento', 'No Responsable']).withMessage('Condición impositiva inválida'),
  
  body('fechaEmision')
    .optional()
    .isISO8601().withMessage('La fecha de emisión debe tener un formato válido')
    .toDate(),
  
  body('fechaVencimiento')
    .optional()
    .isISO8601().withMessage('La fecha de vencimiento debe tener un formato válido')
    .toDate(),
  
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

const validateGenerarDesdeGastos = [
  body('evento')
    .notEmpty().withMessage('El evento es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de evento inválido');
      }
      return true;
    }),
  
  body('margenPorcentaje')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El margen porcentual debe estar entre 0 y 100')
    .toFloat(),
  
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

const validateGenerarDesdeCotizacion = [
  body('cotizacion')
    .notEmpty().withMessage('La cotización es obligatoria')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de cotización inválido');
      }
      return true;
    }),
  
  body('margenPorcentaje')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El margen porcentual debe estar entre 0 y 100')
    .toFloat(),
  
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
router.get('/', facturaController.listFacturas);
router.get('/evento/:eventoId', validateIdParam, facturaController.getFacturasPorEvento);
router.get('/evento/:eventoId/rentabilidad', validateIdParam, facturaController.getReporteRentabilidad);
router.get('/:id', validateIdParam, facturaController.getFactura);
router.post('/', validateFactura, auditoriaFinanciera('FacturaCliente', 'create'), facturaController.addFactura);
router.post('/generar-desde-gastos', validateGenerarDesdeGastos, auditoriaFinanciera('FacturaCliente', 'create'), facturaController.generarFacturaDesdeGastos);
router.post('/generar-desde-cotizacion', validateGenerarDesdeCotizacion, auditoriaFinanciera('FacturaCliente', 'create'), facturaController.generarFacturaDesdeCotizacion);
router.put('/:id', validateIdParam, validateFactura, auditoriaFinanciera('FacturaCliente', 'update'), facturaController.updateFactura);
router.post('/:id/aprobar', validateIdParam, validateAprobar, auditoriaFinanciera('FacturaCliente', 'approve'), facturaController.aprobarFactura);
router.post('/:id/marcar-pagada', validateIdParam, auditoriaFinanciera('FacturaCliente', 'update'), facturaController.marcarComoPagada);
router.delete('/:id', validateIdParam, auditoriaFinanciera('FacturaCliente', 'delete'), facturaController.deleteFactura);

export default router;

