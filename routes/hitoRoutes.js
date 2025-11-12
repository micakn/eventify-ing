// routes/hitoRoutes.js
import express from 'express';
import hitoController from '../controllers/hitoController.js';
import { validateIdParam } from '../middleware/validations.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';
import mongoose from 'mongoose';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateHito = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 200 }).withMessage('El nombre debe tener entre 2 y 200 caracteres'),
  
  body('evento')
    .notEmpty().withMessage('El evento es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de evento inválido');
      }
      return true;
    }),
  
  body('fechaInicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('La fecha de inicio debe tener un formato válido'),
  
  body('fechaFin')
    .notEmpty().withMessage('La fecha de fin es obligatoria')
    .isISO8601().withMessage('La fecha de fin debe tener un formato válido')
    .custom((fechaFin, { req }) => {
      if (req.body.fechaInicio && new Date(fechaFin) < new Date(req.body.fechaInicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  
  body('estado')
    .optional()
    .isIn(['pendiente', 'en_progreso', 'completado', 'atrasado', 'cancelado']).withMessage('Estado inválido'),
  
  body('tipo')
    .optional()
    .isIn(['reunion', 'tarea', 'hito', 'revision', 'entrega']).withMessage('Tipo inválido'),
  
  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta', 'critica']).withMessage('Prioridad inválida'),
  
  body('responsable')
    .optional()
    .custom((id) => {
      if (id && !mongoose.isValidObjectId(id)) {
        throw new Error('ID de responsable inválido');
      }
      return true;
    }),
  
  body('dependencias')
    .optional()
    .isArray().withMessage('Las dependencias deben ser un array')
    .custom((deps) => {
      if (deps && deps.some(id => !mongoose.isValidObjectId(id))) {
        throw new Error('Uno o más IDs de dependencias son inválidos');
      }
      return true;
    }),
  
  validate
];

// -------------------- RUTAS --------------------
router.get('/', hitoController.listHitos);
router.get('/evento/:eventoId', validateIdParam, hitoController.getHitosPorEvento);
router.get('/:id', validateIdParam, hitoController.getHito);
router.post('/', validateHito, hitoController.addHito);
router.put('/:id', validateIdParam, validateHito, hitoController.updateHito);
router.patch('/:id', validateIdParam, hitoController.patchHito);
router.post('/:id/completar', validateIdParam, hitoController.completarHito);
router.delete('/:id', validateIdParam, hitoController.deleteHito);

export default router;

