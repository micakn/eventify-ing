// routes/rsvpRoutes.js
// -------------------- RUTAS PÚBLICAS PARA RSVP --------------------
import express from 'express';
import InvitacionModel from '../models/InvitacionModel.js';
import InvitadoModel from '../models/InvitadoModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// -------------------- MOSTRAR FORMULARIO RSVP (Vista pública) --------------------
router.get('/:enlaceUnico', asyncHandler(async (req, res) => {
  const { enlaceUnico } = req.params;
  
  const invitacion = await InvitacionModel.getByEnlaceUnico(enlaceUnico);
  
  if (!invitacion) {
    return res.status(404).render('error', {
      title: 'Invitación no encontrada',
      message: 'El enlace de invitación no es válido o ha expirado'
    });
  }

  // Marcar como abierta si aún no se ha respondido
  if (invitacion.estado === 'enviada') {
    await InvitacionModel.marcarComoAbierta(enlaceUnico);
  }

  res.render('rsvp/index', {
    title: 'Confirmar Asistencia - Eventify',
    invitacion
  });
}));

export default router;

