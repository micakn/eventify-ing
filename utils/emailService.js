// utils/emailService.js
// -------------------- SERVICIO DE ENVÍO DE EMAILS --------------------
import nodemailer from 'nodemailer';

// -------------------- CONFIGURACIÓN DEL TRANSPORT --------------------
const createTransporter = () => {
  // En producción, usar variables de entorno
  // Por ahora, configuración básica para desarrollo
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  });

  return transporter;
};

// -------------------- FUNCIÓN: Enviar invitación --------------------
export async function enviarInvitacion(invitado, evento, enlaceRSVP) {
  try {
    const transporter = createTransporter();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a90e2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4a90e2; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎟️ Eventify</h1>
            <h2>Estás invitado</h2>
          </div>
          <div class="content">
            <p>Hola ${invitado.nombre} ${invitado.apellido || ''},</p>
            <p>Te invitamos a participar en nuestro evento:</p>
            <h3>${evento.nombre}</h3>
            <p><strong>Fecha:</strong> ${new Date(evento.fechaInicio).toLocaleDateString('es-AR')}</p>
            ${evento.lugar ? `<p><strong>Lugar:</strong> ${evento.lugar}</p>` : ''}
            ${evento.descripcion ? `<p>${evento.descripcion}</p>` : ''}
            <p>Por favor, confirma tu asistencia haciendo clic en el siguiente enlace:</p>
            <div style="text-align: center;">
              <a href="${enlaceRSVP}" class="button">Confirmar Asistencia</a>
            </div>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${enlaceRSVP}</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático de Eventify. Por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'Eventify <noreply@eventify.com>',
      to: invitado.email,
      subject: `Invitación: ${evento.nombre}`,
      html: html,
      text: `Hola ${invitado.nombre}, estás invitado a ${evento.nombre}. Confirma tu asistencia en: ${enlaceRSVP}`
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return { success: false, error: error.message };
  }
}

// -------------------- FUNCIÓN: Enviar recordatorio --------------------
export async function enviarRecordatorio(invitado, evento, enlaceRSVP) {
  try {
    const transporter = createTransporter();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f39c12; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #f39c12; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Recordatorio</h1>
          </div>
          <div class="content">
            <p>Hola ${invitado.nombre},</p>
            <p>Este es un recordatorio de que estás invitado a:</p>
            <h3>${evento.nombre}</h3>
            <p><strong>Fecha:</strong> ${new Date(evento.fechaInicio).toLocaleDateString('es-AR')}</p>
            ${evento.lugar ? `<p><strong>Lugar:</strong> ${evento.lugar}</p>` : ''}
            <p>Si aún no has confirmado tu asistencia, por favor hazlo ahora:</p>
            <div style="text-align: center;">
              <a href="${enlaceRSVP}" class="button">Confirmar Asistencia</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'Eventify <noreply@eventify.com>',
      to: invitado.email,
      subject: `Recordatorio: ${evento.nombre}`,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar recordatorio:', error);
    return { success: false, error: error.message };
  }
}

// -------------------- FUNCIÓN: Enviar múltiples invitaciones --------------------
export async function enviarInvitacionesMasivas(invitaciones, evento, baseURL) {
  const resultados = [];
  
  for (const invitacion of invitaciones) {
    const enlaceRSVP = `${baseURL}/rsvp/${invitacion.enlaceUnico}`;
    const resultado = await enviarInvitacion(invitacion.invitado, evento, enlaceRSVP);
    resultados.push({
      invitado: invitacion.invitado.email,
      success: resultado.success,
      error: resultado.error
    });
  }
  
  return resultados;
}

