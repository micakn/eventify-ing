// routes/eventoWebRoutes.js
import express from 'express';
import EventoWebController from '../controllers/eventoWebController.js';

const router = express.Router();

// Rutas para eventos
router.get('/', EventoWebController.listarEventos);
router.get('/nuevo', EventoWebController.mostrarFormularioCrear);
router.post('/', EventoWebController.crearEvento);
router.get('/editar/:id', EventoWebController.mostrarFormularioEditar);
router.put('/:id', EventoWebController.actualizarEvento);
router.delete('/:id', EventoWebController.eliminarEvento);

export default router;

