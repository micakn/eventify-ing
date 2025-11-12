// routes/cotizacionRoutes.js
import express from 'express';
import cotizacionController from '../controllers/cotizacionController.js';
import itemCotizacionController from '../controllers/itemCotizacionController.js';
import { validateIdParam } from '../middleware/validations.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';
import mongoose from 'mongoose';
import { auditoriaFinanciera } from '../middleware/auditoria.js';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateCotizacion = [
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
    .isFloat({ min: 0, max: 100 }).withMessage('El margen debe ser entre 0 y 100')
    .toFloat(),
  
  body('estado')
    .optional()
    .isIn(['borrador', 'pendiente', 'aprobada', 'rechazada', 'vencida'])
    .withMessage('Estado inválido'),
  
  validate
];

const validateItemCotizacion = [
  body('cotizacion')
    .notEmpty().withMessage('La cotización es obligatoria')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de cotización inválido');
      }
      return true;
    }),
  
  body('proveedor')
    .notEmpty().withMessage('El proveedor es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de proveedor inválido');
      }
      return true;
    }),
  
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 3, max: 500 }).withMessage('La descripción debe tener entre 3 y 500 caracteres'),
  
  body('cantidad')
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isFloat({ min: 0.01 }).withMessage('La cantidad debe ser mayor a 0')
    .toFloat(),
  
  body('precioUnitario')
    .notEmpty().withMessage('El precio unitario es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio unitario debe ser mayor o igual a 0')
    .toFloat(),
  
  body('categoria')
    .optional()
    .isIn(['Catering', 'Sonido', 'Iluminación', 'Decoración', 'Logística', 'Otros'])
    .withMessage('Categoría inválida'),
  
  validate
];

// -------------------- RUTAS DE COTIZACIONES --------------------
router.get('/', cotizacionController.listCotizaciones);
router.get('/:id', validateIdParam, cotizacionController.getCotizacion);
router.get('/:id/historial', validateIdParam, cotizacionController.getHistorial);
router.post('/', validateCotizacion, auditoriaFinanciera('Cotizacion', 'create'), cotizacionController.addCotizacion);
router.put('/:id', validateIdParam, validateCotizacion, auditoriaFinanciera('Cotizacion', 'update'), cotizacionController.updateCotizacion);
router.patch('/:id', validateIdParam, auditoriaFinanciera('Cotizacion', 'update'), cotizacionController.updateCotizacion);
router.post('/:id/version', validateIdParam, auditoriaFinanciera('Cotizacion', 'create'), cotizacionController.crearVersion);
router.post('/:id/aprobar', validateIdParam, auditoriaFinanciera('Cotizacion', 'approve'), cotizacionController.aprobarCotizacion);
router.post('/:id/enviar', validateIdParam, auditoriaFinanciera('Cotizacion', 'update'), cotizacionController.enviarCotizacion);
router.post('/:id/recalcular', validateIdParam, cotizacionController.recalcularTotales);
router.get('/:id/pdf', validateIdParam, cotizacionController.generarPDF);
router.delete('/:id', validateIdParam, auditoriaFinanciera('Cotizacion', 'delete'), cotizacionController.deleteCotizacion);

// -------------------- RUTAS DE ITEMS --------------------
router.get('/:cotizacionId/items', validateIdParam, itemCotizacionController.getItemsByCotizacion);
router.get('/items/:id', validateIdParam, itemCotizacionController.getItem);
router.post('/items', validateItemCotizacion, itemCotizacionController.addItem);
router.put('/items/:id', validateIdParam, validateItemCotizacion, itemCotizacionController.updateItem);
router.delete('/items/:id', validateIdParam, itemCotizacionController.deleteItem);

export default router;

