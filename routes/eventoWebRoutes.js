// routes/eventoWebRoutes.js
import express from 'express';
import eventoWebController from '../controllers/eventoWebController.js';

const router = express.Router();

router.get('/', eventoWebController.listEventosWeb);
router.get('/nuevo', eventoWebController.showNewForm);
router.get('/editar/:id', eventoWebController.showEditForm);
router.get('/:id', eventoWebController.showEvento);

router.post('/', eventoWebController.createEventoWeb);
router.put('/:id', eventoWebController.updateEventoWeb);
router.delete('/:id', eventoWebController.deleteEventoWeb);

export default router;

