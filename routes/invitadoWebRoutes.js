// routes/invitadoWebRoutes.js
import express from 'express';
import invitadoWebController from '../controllers/invitadoWebController.js';

const router = express.Router();

router.get('/', invitadoWebController.listInvitadosWeb);
router.get('/nuevo', invitadoWebController.showNewForm);
router.get('/:id', invitadoWebController.showInvitado);

router.post('/', invitadoWebController.createInvitadoWeb);
router.delete('/:id', invitadoWebController.deleteInvitadoWeb);

export default router;

