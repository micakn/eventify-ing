// middleware/errorHandler.js
// -------------------- MANEJO CENTRALIZADO DE ERRORES --------------------

/**
 * Middleware para manejar errores de manera centralizada
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: errors
    });
  }

  // Error de ObjectId inválido
  if (err.name === 'CastError') {
    return res.status(400).json({
      mensaje: 'ID inválido',
      detalle: 'El formato del ID proporcionado no es válido'
    });
  }

  // Error de duplicado (índice único)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      mensaje: 'Recurso duplicado',
      detalle: `El ${campo} ya existe en el sistema`
    });
  }

  // Error de validación personalizado
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      mensaje: err.mensaje || 'Error en la solicitud',
      detalle: err.detalle || err.message
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error inesperado'
  });
};

/**
 * Wrapper para manejar errores asíncronos en rutas
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

