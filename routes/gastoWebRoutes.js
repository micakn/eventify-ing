// routes/gastoWebRoutes.js
import express from 'express';
import gastoWebController from '../controllers/gastoWebController.js';

const router = express.Router();

router.get('/', gastoWebController.listGastosWeb);
router.get('/nuevo', gastoWebController.showNewForm);
router.get('/editar/:id', gastoWebController.showEditForm);
router.get('/:id', gastoWebController.showGasto);

router.post('/', gastoWebController.createGastoWeb);
router.put('/:id', gastoWebController.updateGastoWeb);
router.delete('/:id', gastoWebController.deleteGastoWeb);

export default router;

