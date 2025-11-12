// routes/eventoRoutes.js
import express from 'express';
import eventoController from '../controllers/eventoController.js';
import { validateEvento, validateIdParam } from '../middleware/validations.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';
import mongoose from 'mongoose';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateResponsable = [
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

const validateEstado = [
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['planificacion', 'en_curso', 'ejecutado', 'cerrado', 'cancelado']).withMessage('Estado inválido'),
  validate
];

// -------------------- RUTAS --------------------
router.get('/', eventoController.listEventos); // LISTAR todos los eventos
router.get('/:id', validateIdParam, eventoController.getEvento); // OBTENER un evento por ID
router.get('/:id/cronograma', validateIdParam, eventoController.getCronograma); // OBTENER cronograma del evento
router.post('/', validateEvento, eventoController.addEvento); // CREAR un nuevo evento
router.put('/:id', validateIdParam, validateEvento, eventoController.updateEvento); // REEMPLAZAR un evento completo
router.patch('/:id', validateIdParam, validateEvento, eventoController.patchEvento); // ACTUALIZAR parcialmente un evento
router.post('/:id/responsables', validateIdParam, validateResponsable, eventoController.agregarResponsable); // AGREGAR responsable
router.delete('/:id/responsables', validateIdParam, validateResponsable, eventoController.removerResponsable); // REMOVER responsable
router.patch('/:id/estado', validateIdParam, validateEstado, eventoController.cambiarEstado); // CAMBIAR estado
router.delete('/:id', validateIdParam, eventoController.deleteEvento); // ELIMINAR un evento

export default router;

