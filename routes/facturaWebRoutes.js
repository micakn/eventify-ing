// routes/facturaWebRoutes.js
import express from 'express';
import facturaWebController from '../controllers/facturaWebController.js';

const router = express.Router();

router.get('/', facturaWebController.listFacturasWeb);
router.get('/:id', facturaWebController.showFactura);

export default router;

