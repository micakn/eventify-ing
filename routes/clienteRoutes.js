// routes/clienteRoutes.js
import express from 'express';
import clienteController from '../controllers/clienteController.js';
import { validateCliente, validateIdParam } from '../middleware/validations.js';

const router = express.Router();

router.get('/', clienteController.listClientes); // LISTAR todos los clientes
router.get('/:id', validateIdParam, clienteController.getCliente); // OBTENER un cliente por ID
router.post('/', validateCliente, clienteController.addCliente); // CREAR un nuevo cliente
router.put('/:id', validateIdParam, validateCliente, clienteController.updateCliente); // REEMPLAZAR un cliente completo
router.patch('/:id', validateIdParam, validateCliente, clienteController.patchCliente); // ACTUALIZAR parcialmente un cliente
router.delete('/:id', validateIdParam, clienteController.deleteCliente); // ELIMINAR un cliente

export default router;
