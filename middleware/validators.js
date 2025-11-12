// middleware/validators.js
// -------------------- VALIDADORES Y MIDDLEWARES --------------------
import mongoose from 'mongoose';

/**
 * Valida que el ID sea un ObjectId válido de MongoDB
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(400).json({
        mensaje: 'ID requerido',
        detalle: `El parámetro ${paramName} es obligatorio`
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: 'ID inválido',
        detalle: `El formato del ${paramName} no es válido`
      });
    }

    next();
  };
};

/**
 * Valida que un ObjectId referenciado exista en la base de datos
 */
export const validateReference = (Model, fieldName, populateFields = null) => {
  return async (req, res, next) => {
    try {
      const id = req.body[fieldName] || req.query[fieldName];
      
      if (!id) {
        return next(); // Si no se proporciona, no validamos (puede ser opcional)
      }

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          mensaje: 'Referencia inválida',
          detalle: `El ${fieldName} proporcionado no es un ID válido`
        });
      }

      const exists = await Model.findById(id);
      if (!exists) {
        return res.status(404).json({
          mensaje: 'Referencia no encontrada',
          detalle: `El ${fieldName} especificado no existe en el sistema`
        });
      }

      // Agregar el documento encontrado al request para uso posterior
      req[`validated${fieldName}`] = exists;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Valida que las fechas sean válidas y que fechaFin sea posterior a fechaInicio
 */
export const validateDateRange = (req, res, next) => {
  const { fechaInicio, fechaFin } = req.body;

  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return res.status(400).json({
        mensaje: 'Fechas inválidas',
        detalle: 'Las fechas proporcionadas no tienen un formato válido'
      });
    }

    if (fin < inicio) {
      return res.status(400).json({
        mensaje: 'Rango de fechas inválido',
        detalle: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }
  }

  next();
};

