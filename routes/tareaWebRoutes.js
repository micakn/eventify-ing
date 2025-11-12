// routes/tareaWebRoutes.js
import express from 'express';
import tareaWebController from '../controllers/tareaWebController.js';

const router = express.Router();

router.get('/', tareaWebController.listTareasWeb);
router.get('/nuevo', tareaWebController.showNewForm);
router.get('/editar/:id', tareaWebController.showEditForm);
router.get('/:id', tareaWebController.showTarea);

router.post('/', tareaWebController.createTareaWeb);
router.patch('/:id', tareaWebController.updateTareaWeb);
router.delete('/:id', tareaWebController.deleteTareaWeb);

export default router;

