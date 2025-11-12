// routes/proveedorWebRoutes.js
import express from 'express';
import proveedorWebController from '../controllers/proveedorWebController.js';

const router = express.Router();

router.get('/', proveedorWebController.listProveedoresWeb);
router.get('/nuevo', proveedorWebController.showNewForm);
router.get('/editar/:id', proveedorWebController.showEditForm);
router.get('/:id', proveedorWebController.showProveedor);

router.post('/', proveedorWebController.createProveedorWeb);
router.put('/:id', proveedorWebController.updateProveedorWeb);
router.delete('/:id', proveedorWebController.deleteProveedorWeb);

export default router;

