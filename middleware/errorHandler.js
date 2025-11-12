// middleware/errorHandler.js
// -------------------- MANEJO CENTRALIZADO DE ERRORES --------------------

/**
 * Middleware para manejar errores de manera centralizada
 */
export const errorHandler = (err, req, res, next) => {
  // Siempre loguear el error completo para debugging
  console.error('❌ Error capturado en errorHandler:');
  console.error('Mensaje:', err.message);
  console.error('Stack:', err.stack);
  console.error('Nombre:', err.name);
  if (err.code) console.error('Código:', err.code);
  console.error('URL:', req.url);
  console.error('Método:', req.method);

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
  // En Vercel, mostrar más información para debugging
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  const showDetails = process.env.NODE_ENV === 'development' || isVercel;
  
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    detalle: showDetails ? err.message : 'Ocurrió un error inesperado',
    tipo: showDetails ? err.name : undefined,
    ...(showDetails && err.stack ? { stack: err.stack } : {})
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

