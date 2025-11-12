// routes/cotizacionWebRoutes.js
import express from 'express';
import cotizacionWebController from '../controllers/cotizacionWebController.js';

const router = express.Router();

router.get('/', cotizacionWebController.listCotizacionesWeb);
router.get('/nuevo', cotizacionWebController.showNewForm);
router.get('/editar/:id', cotizacionWebController.showEditForm);
router.get('/:id', cotizacionWebController.showCotizacion);

router.post('/', cotizacionWebController.createCotizacionWeb);
router.put('/:id', cotizacionWebController.updateCotizacionWeb);
router.delete('/:id', cotizacionWebController.deleteCotizacionWeb);

export default router;

