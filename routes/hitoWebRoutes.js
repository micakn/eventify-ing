// routes/hitoWebRoutes.js
import express from 'express';
import hitoWebController from '../controllers/hitoWebController.js';

const router = express.Router();

router.get('/', hitoWebController.listHitosWeb);
router.get('/nuevo', hitoWebController.showNewForm);
router.get('/:id', hitoWebController.showHito);

router.post('/', hitoWebController.createHitoWeb);
router.delete('/:id', hitoWebController.deleteHitoWeb);

export default router;

