// routes/tareaRoutes.js
import express from 'express';
import tareaController from '../controllers/tareaController.js';
import { validateTarea, validateIdParam } from '../middleware/validations.js';

const router = express.Router();

router.get('/', tareaController.listTareas); // LISTAR todas las tareas y filtrarlas
router.get('/:id', validateIdParam, tareaController.getTarea); // OBTENER tarea por ID
router.post('/', validateTarea, tareaController.addTarea); // CREAR nueva tarea
router.put('/:id', validateIdParam, validateTarea, tareaController.updateTarea); // REEMPLAZAR tarea completa
router.patch('/:id', validateIdParam, validateTarea, tareaController.patchTarea); // ACTUALIZAR parcial de tarea
router.delete('/:id', validateIdParam, tareaController.deleteTarea); // ELIMINAR tarea

export default router;


