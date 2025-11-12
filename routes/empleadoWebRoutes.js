// routes/empleadoWebRoutes.js
import express from 'express';
import empleadoWebController from '../controllers/empleadoWebController.js';

const router = express.Router();

router.get('/', empleadoWebController.listEmpleadosWeb);
router.get('/nuevo', empleadoWebController.showNewForm);
router.get('/editar/:id', empleadoWebController.showEditForm);
router.get('/:id', empleadoWebController.showEmpleado);

router.post('/', empleadoWebController.createEmpleadoWeb);
router.put('/:id', empleadoWebController.updateEmpleadoWeb);
router.delete('/:id', empleadoWebController.deleteEmpleadoWeb);

export default router;

