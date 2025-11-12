// controllers/invitadoController.js
// -------------------- CONTROLADOR DE INVITADOS --------------------
import InvitadoModel from '../models/InvitadoModel.js';
import InvitacionModel from '../models/InvitacionModel.js';
import EventoModel from '../models/EventoModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generarQRInvitado, generarQRDataURL } from '../utils/qrGenerator.js';
import { enviarInvitacion, enviarRecordatorio, enviarInvitacionesMasivas } from '../utils/emailService.js';
import { leerExcel, mapearDatosInvitados, validarInvitados } from '../utils/excelImporter.js';

// -------------------- LISTAR INVITADOS --------------------
const listInvitados = asyncHandler(async (req, res) => {
  const { evento, estadoRSVP, categoria, checkedIn } = req.query;
  
  const filtros = {};
  if (evento) filtros.evento = evento;
  if (estadoRSVP) filtros.estadoRSVP = estadoRSVP;
  if (categoria) filtros.categoria = categoria;
  if (checkedIn !== undefined) filtros.checkedIn = checkedIn === 'true';

  const invitados = await InvitadoModel.getAll(filtros);
  
  res.json({
    total: invitados.length,
    invitados
  });
});

// -------------------- OBTENER INVITADO POR ID --------------------
const getInvitado = asyncHandler(async (req, res) => {
  const invitado = await InvitadoModel.getById(req.params.id);
  if (!invitado) {
    return res.status(404).json({
      mensaje: 'Invitado no encontrado',
      detalle: `No existe un invitado con el ID ${req.params.id}`
    });
  }
  res.json(invitado);
});

// -------------------- OBTENER ESTADÍSTICAS DE INVITADOS --------------------
const getEstadisticas = asyncHandler(async (req, res) => {
  const { evento } = req.query;
  
  if (!evento) {
    return res.status(400).json({
      mensaje: 'Evento requerido',
      detalle: 'Debe proporcionar el ID del evento'
    });
  }

  const estadisticas = await InvitadoModel.getEstadisticas(evento);
  if (!estadisticas) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  res.json({
    evento,
    estadisticas
  });
});

// -------------------- IMPORTAR INVITADOS DESDE EXCEL --------------------
const importarInvitados = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      mensaje: 'Archivo requerido',
      detalle: 'Debe proporcionar un archivo Excel o CSV'
    });
  }

  const { evento } = req.body;
  const mapeo = req.body.mapeo ? JSON.parse(req.body.mapeo) : {};
  
  if (!evento) {
    return res.status(400).json({
      mensaje: 'Evento requerido',
      detalle: 'Debe proporcionar el ID del evento'
    });
  }

  // Validar que el evento existe
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  try {
    // Leer archivo Excel
    const datos = leerExcel(req.file.buffer, req.file.originalname);
    
    // Mapear datos
    const invitadosMapeados = mapearDatosInvitados(datos, mapeo);
    
    // Validar datos
    const validacion = validarInvitados(invitadosMapeados);
    
    if (validacion.invalidos.length > 0) {
      return res.status(400).json({
        mensaje: 'Errores de validación',
        detalle: 'Algunos invitados tienen datos inválidos',
        validos: validacion.validos.length,
        invalidos: validacion.invalidos.length,
        errores: validacion.errores
      });
    }

    // Agregar evento a cada invitado
    const invitadosConEvento = validacion.validos.map(inv => ({
      ...inv,
      evento
    }));

    // Crear invitados uno por uno para evitar duplicados
    const invitadosCreados = [];
    const errores = [];
    
    for (const invitadoData of invitadosConEvento) {
      try {
        // Verificar si ya existe
        const existente = await InvitadoModel.getByEmail(invitadoData.email, evento);
        if (existente) {
          errores.push({
            email: invitadoData.email,
            error: 'Ya existe un invitado con este email para este evento'
          });
          continue;
        }
        
        const creado = await InvitadoModel.add(invitadoData);
        if (creado) {
          invitadosCreados.push(creado);
        } else {
          errores.push({
            email: invitadoData.email,
            error: 'Error al crear invitado'
          });
        }
      } catch (error) {
        errores.push({
          email: invitadoData.email,
          error: error.message
        });
      }
    }

    res.status(201).json({
      mensaje: 'Invitados importados exitosamente',
      total: invitadosConEvento.length,
      creados: invitadosCreados.length,
      errores: errores.length,
      invitados: invitadosCreados,
      detallesErrores: errores
    });
  } catch (error) {
    console.error('Error al importar invitados:', error);
    return res.status(400).json({
      mensaje: 'Error al procesar archivo',
      detalle: error.message
    });
  }
});

// -------------------- CREAR INVITADO --------------------
const addInvitado = asyncHandler(async (req, res) => {
  const { evento } = req.body;

  // Validar que el evento existe
  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  const nuevoInvitado = await InvitadoModel.add(req.body);
  if (!nuevoInvitado) {
    return res.status(500).json({
      mensaje: 'Error al crear invitado',
      detalle: 'No se pudo crear el invitado en la base de datos'
    });
  }

  res.status(201).json({
    mensaje: 'Invitado creado exitosamente',
    invitado: nuevoInvitado
  });
});

// -------------------- ACTUALIZAR INVITADO --------------------
const updateInvitado = asyncHandler(async (req, res) => {
  const actualizado = await InvitadoModel.update(req.params.id, req.body);
  if (!actualizado) {
    return res.status(404).json({
      mensaje: 'Invitado no encontrado',
      detalle: `No existe un invitado con el ID ${req.params.id}`
    });
  }
  res.json({
    mensaje: 'Invitado actualizado exitosamente',
    invitado: actualizado
  });
});

// -------------------- ENVIAR INVITACIONES --------------------
const enviarInvitaciones = asyncHandler(async (req, res) => {
  const { evento, invitados, recordatorio } = req.body;
  const baseURL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  if (!evento) {
    return res.status(400).json({
      mensaje: 'Evento requerido',
      detalle: 'Debe proporcionar el ID del evento'
    });
  }

  const eventoExiste = await EventoModel.getById(evento);
  if (!eventoExiste) {
    return res.status(404).json({
      mensaje: 'Evento no encontrado',
      detalle: `No existe un evento con el ID ${evento}`
    });
  }

  // Obtener invitados
  let invitadosLista = [];
  if (invitados && Array.isArray(invitados) && invitados.length > 0) {
    // Invitados específicos
    invitadosLista = await Promise.all(
      invitados.map(id => InvitadoModel.getById(id))
    );
    invitadosLista = invitadosLista.filter(i => i !== null);
  } else {
    // Todos los invitados del evento que no tengan invitación enviada
    const todosInvitados = await InvitadoModel.getByEvento(evento);
    const invitacionesExistentes = await InvitacionModel.getByEvento(evento);
    const emailsConInvitacion = new Set(
      invitacionesExistentes.map(inv => inv.invitado.email)
    );
    
    invitadosLista = todosInvitados.filter(
      inv => !emailsConInvitacion.has(inv.email)
    );
  }

  if (invitadosLista.length === 0) {
    return res.status(400).json({
      mensaje: 'No hay invitados para enviar',
      detalle: 'No se encontraron invitados sin invitación enviada'
    });
  }

  // Crear invitaciones
  const invitaciones = [];
  for (const invitado of invitadosLista) {
    let invitacion = await InvitacionModel.getByInvitado(invitado.id);
    
    if (!invitacion) {
      invitacion = await InvitacionModel.add({
        invitado: invitado.id,
        evento: evento
      });
    }
    
    if (invitacion) {
      invitaciones.push({
        invitacion,
        invitado
      });
    }
  }

  // Enviar emails
  const resultados = [];
  for (const { invitacion, invitado } of invitaciones) {
    const enlaceRSVP = `${baseURL}/rsvp/${invitacion.enlaceUnico}`;
    
    const resultado = recordatorio 
      ? await enviarRecordatorio(invitado, eventoExiste, enlaceRSVP)
      : await enviarInvitacion(invitado, eventoExiste, enlaceRSVP);
    
    if (resultado.success) {
      await InvitacionModel.incrementarIntentoEnvio(invitacion.id);
    }
    
    resultados.push({
      email: invitado.email,
      success: resultado.success,
      error: resultado.error
    });
  }

  const exitosos = resultados.filter(r => r.success).length;
  const fallidos = resultados.filter(r => !r.success).length;

  res.json({
    mensaje: 'Invitaciones procesadas',
    total: resultados.length,
    exitosos,
    fallidos,
    resultados
  });
});

// -------------------- RESPONDER RSVP --------------------
const responderRSVP = asyncHandler(async (req, res) => {
  const { enlaceUnico } = req.params;
  const { respuesta } = req.body;

  if (!respuesta || !['confirmado', 'rechazado', 'talvez'].includes(respuesta)) {
    return res.status(400).json({
      mensaje: 'Respuesta inválida',
      detalle: 'La respuesta debe ser: confirmado, rechazado o talvez'
    });
  }

  const resultado = await InvitacionModel.responder(enlaceUnico, respuesta);
  
  if (!resultado) {
    return res.status(404).json({
      mensaje: 'Invitación no encontrada',
      detalle: 'El enlace de invitación no es válido'
    });
  }

  if (resultado.error) {
    return res.status(400).json({
      mensaje: resultado.error,
      detalle: 'La invitación ha expirado'
    });
  }

  res.json({
    mensaje: 'Respuesta registrada exitosamente',
    invitacion: resultado
  });
});

// -------------------- CHECK-IN (ACREDITACIÓN) --------------------
const checkIn = asyncHandler(async (req, res) => {
  const { codigoQR } = req.body;

  if (!codigoQR) {
    return res.status(400).json({
      mensaje: 'Código QR requerido',
      detalle: 'Debe proporcionar el código QR del invitado'
    });
  }

  const resultado = await InvitadoModel.checkIn(codigoQR);
  
  if (!resultado.success) {
    return res.status(400).json({
      mensaje: resultado.mensaje,
      invitado: resultado.invitado || null
    });
  }

  res.json({
    mensaje: 'Check-in realizado exitosamente',
    invitado: resultado.invitado
  });
});

// -------------------- GENERAR QR DE INVITADO --------------------
const generarQR = asyncHandler(async (req, res) => {
  const invitado = await InvitadoModel.getById(req.params.id);
  if (!invitado) {
    return res.status(404).json({
      mensaje: 'Invitado no encontrado',
      detalle: `No existe un invitado con el ID ${req.params.id}`
    });
  }

  if (!invitado.codigoQR) {
    // Generar código QR si no existe
    await InvitadoModel.patch(invitado.id, { estadoRSVP: 'confirmado' });
    const invitadoActualizado = await InvitadoModel.getById(req.params.id);
    
    if (!invitadoActualizado.codigoQR) {
      return res.status(500).json({
        mensaje: 'Error al generar código QR',
        detalle: 'No se pudo generar el código QR para el invitado'
      });
    }
    
    invitado.codigoQR = invitadoActualizado.codigoQR;
  }

  try {
    const evento = invitado.evento;
    const qrBuffer = await generarQRInvitado(invitado, evento);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qr-${invitado.codigoQR}.png"`);
    res.send(qrBuffer);
  } catch (error) {
    console.error('Error al generar QR:', error);
    return res.status(500).json({
      mensaje: 'Error al generar código QR',
      detalle: 'No se pudo generar la imagen del código QR'
    });
  }
});

// -------------------- ELIMINAR INVITADO --------------------
const deleteInvitado = asyncHandler(async (req, res) => {
  const eliminado = await InvitadoModel.remove(req.params.id);
  if (!eliminado) {
    return res.status(404).json({
      mensaje: 'Invitado no encontrado',
      detalle: `No existe un invitado con el ID ${req.params.id}`
    });
  }

  // Eliminar invitación asociada si existe (esto se hace automáticamente)
  // await InvitacionModel.removeByInvitado(eliminado.id);

  res.json({
    mensaje: 'Invitado eliminado exitosamente',
    invitado: eliminado
  });
});

export default {
  listInvitados,
  getInvitado,
  getEstadisticas,
  importarInvitados,
  addInvitado,
  updateInvitado,
  enviarInvitaciones,
  responderRSVP,
  checkIn,
  generarQR,
  deleteInvitado
};

