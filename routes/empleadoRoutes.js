// routes/empleadoRoutes.js
import express from 'express';
import empleadoController from '../controllers/empleadoController.js';
import { validateEmpleado, validateIdParam } from '../middleware/validations.js';

const router = express.Router();

router.get('/', empleadoController.listEmpleados); // LISTAR todos los empleados
router.get('/:id', validateIdParam, empleadoController.getEmpleado); // OBTENER empleado por ID
router.post('/', validateEmpleado, empleadoController.addEmpleado); // CREAR un nuevo empleado
router.put('/:id', validateIdParam, validateEmpleado, empleadoController.updateEmpleado); // REEMPLAZAR un empleado completo
router.patch('/:id', validateIdParam, validateEmpleado, empleadoController.patchEmpleado); // ACTUALIZAR parcialmente un empleado
router.delete('/:id', validateIdParam, empleadoController.deleteEmpleado); // ELIMINAR un empleado

export default router;



