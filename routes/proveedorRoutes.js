// routes/proveedorRoutes.js
import express from 'express';
import proveedorController from '../controllers/proveedorController.js';
import { validateIdParam } from '../middleware/validations.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateProveedor = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 200 }).withMessage('El nombre debe tener entre 2 y 200 caracteres'),
  
  body('contacto.email')
    .optional()
    .trim()
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  
  body('contacto.telefono')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('El teléfono no tiene un formato válido'),
  
  body('servicios')
    .optional()
    .isArray().withMessage('Los servicios deben ser un array'),
  
  body('condicionImpositiva')
    .optional()
    .isIn(['Responsable Inscripto', 'Monotributo', 'Exento', 'No Responsable'])
    .withMessage('Condición impositiva inválida'),
  
  validate
];

// -------------------- RUTAS --------------------
router.get('/', proveedorController.listProveedores);
router.get('/:id', validateIdParam, proveedorController.getProveedor);
router.post('/', validateProveedor, proveedorController.addProveedor);
router.put('/:id', validateIdParam, validateProveedor, proveedorController.updateProveedor);
router.patch('/:id', validateIdParam, validateProveedor, proveedorController.patchProveedor);
router.delete('/:id', validateIdParam, proveedorController.deleteProveedor);

export default router;

