// routes/invitadoRoutes.js
import express from 'express';
import invitadoController from '../controllers/invitadoController.js';
import { validateIdParam } from '../middleware/validations.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validations.js';
import upload from '../middleware/upload.js';
import mongoose from 'mongoose';

const router = express.Router();

// -------------------- VALIDACIONES --------------------
const validateInvitado = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no tiene un formato válido')
    .normalizeEmail(),
  
  body('evento')
    .notEmpty().withMessage('El evento es obligatorio')
    .custom((id) => {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('ID de evento inválido');
      }
      return true;
    }),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('El teléfono no tiene un formato válido'),
  
  body('categoria')
    .optional()
    .isIn(['VIP', 'Estándar', 'Staff', 'Prensa']).withMessage('Categoría inválida'),
  
  body('acompanantes')
    .optional()
    .isInt({ min: 0 }).withMessage('Los acompañantes deben ser un número entero positivo')
    .toInt(),
  
  validate
];

// -------------------- RUTAS --------------------
router.get('/', invitadoController.listInvitados);
router.get('/estadisticas', invitadoController.getEstadisticas);
router.get('/:id', validateIdParam, invitadoController.getInvitado);
router.get('/:id/qr', validateIdParam, invitadoController.generarQR);
router.post('/', validateInvitado, invitadoController.addInvitado);
router.post('/importar', upload.single('archivo'), invitadoController.importarInvitados);
router.post('/enviar-invitaciones', invitadoController.enviarInvitaciones);
router.put('/:id', validateIdParam, validateInvitado, invitadoController.updateInvitado);
router.post('/check-in', invitadoController.checkIn);
router.delete('/:id', validateIdParam, invitadoController.deleteInvitado);

// -------------------- RUTA API PARA RESPONDER RSVP (desde vista pública) --------------------
router.post('/rsvp/:enlaceUnico', invitadoController.responderRSVP);

export default router;

