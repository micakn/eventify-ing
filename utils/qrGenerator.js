// utils/qrGenerator.js
// -------------------- GENERADOR DE CÓDIGOS QR --------------------
import QRCode from 'qrcode';

/**
 * Genera un código QR como Buffer
 * @param {String} data - Datos para codificar en el QR
 * @param {Object} options - Opciones de generación
 * @returns {Promise<Buffer>} - Buffer de la imagen QR
 */
export async function generarQR(data, options = {}) {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 200
    };

    const qrOptions = { ...defaultOptions, ...options };
    const qrBuffer = await QRCode.toBuffer(data, qrOptions);
    return qrBuffer;
  } catch (error) {
    console.error('Error al generar QR:', error);
    throw error;
  }
}

/**
 * Genera un código QR como Data URL (para usar en HTML)
 * @param {String} data - Datos para codificar
 * @param {Object} options - Opciones de generación
 * @returns {Promise<String>} - Data URL del QR
 */
export async function generarQRDataURL(data, options = {}) {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 200
    };

    const qrOptions = { ...defaultOptions, ...options };
    const dataURL = await QRCode.toDataURL(data, qrOptions);
    return dataURL;
  } catch (error) {
    console.error('Error al generar QR Data URL:', error);
    throw error;
  }
}

/**
 * Genera un código QR para un invitado
 * @param {Object} invitado - Objeto del invitado
 * @param {Object} evento - Objeto del evento
 * @returns {Promise<Buffer>} - Buffer del QR
 */
export async function generarQRInvitado(invitado, evento) {
  const data = JSON.stringify({
    codigoQR: invitado.codigoQR,
    invitadoId: invitado.id,
    eventoId: evento.id,
    nombre: `${invitado.nombre} ${invitado.apellido || ''}`,
    email: invitado.email
  });

  return await generarQR(data, {
    width: 300,
    errorCorrectionLevel: 'H' // Mayor corrección de errores
  });
}

