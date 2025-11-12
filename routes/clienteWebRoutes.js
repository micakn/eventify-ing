// routes/clienteWebRoutes.js
import express from 'express';
import ClienteWebController from '../controllers/ClienteWebController.js';

const router = express.Router();

router.get('/', ClienteWebController.listClientesWeb);       // /clientes
router.get('/nuevo', ClienteWebController.showNewForm);      // /clientes/nuevo
router.get('/editar/:id', ClienteWebController.showEditForm);// /clientes/editar/:id
router.get('/:id', ClienteWebController.showCliente);        // /clientes/:id

router.post('/', ClienteWebController.createClienteWeb);     // crear
router.put('/:id', ClienteWebController.updateClienteWeb);   // editar
router.delete('/:id', ClienteWebController.deleteClienteWeb);// eliminar

export default router;
