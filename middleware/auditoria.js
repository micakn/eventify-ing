// middleware/auditoria.js
// -------------------- MIDDLEWARE DE AUDITORÍA --------------------
import AuditoriaModel from '../models/AuditoriaModel.js';

/**
 * Middleware para registrar acciones de auditoría
 * @param {Object} options - Opciones de configuración
 * @param {String} options.entidad - Nombre de la entidad (ej: 'FacturaCliente', 'Gasto')
 * @param {String} options.accion - Acción realizada (ej: 'create', 'update', 'delete')
 * @param {Boolean} options.registrarCambios - Si se deben registrar los cambios (default: true)
 * @param {Boolean} options.operacionFinanciera - Si es una operación financiera crítica (default: false)
 */
export const registrarAuditoria = (options = {}) => {
  return async (req, res, next) => {
    // Guardar referencia a la función original de res.json
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    
    // Guardar datos antes de la operación si es necesario
    let datosAntes = null;
    if (options.registrarCambios !== false && (options.accion === 'update' || options.accion === 'delete')) {
      // Se puede obtener el documento original aquí si es necesario
      // Por ahora, se guardará después de la operación
    }

    // Función auxiliar para registrar auditoría
    const registrar = async (data, statusCode) => {
      try {
        // Para operaciones financieras, siempre intentar registrar (incluso sin usuario para tracking)
        // Para otras operaciones, solo registrar si hay usuario autenticado
        const debeRegistrar = options.operacionFinanciera || req.user;
        
        if (debeRegistrar) {
          const usuarioId = req.user?.id || req.user?._id || null;
          
          // Si no hay usuario y no es operación financiera, no registrar
          if (!usuarioId && !options.operacionFinanciera) {
            return;
          }
          
          const empleadoId = req.user?.empleado 
            ? (typeof req.user.empleado === 'object' 
                ? (req.user.empleado.id || req.user.empleado._id)
                : req.user.empleado)
            : null;
          
          // Obtener entidadId de params, body o respuesta
          const entidadId = req.params.id || req.params.eventoId || req.params.clienteId || 
                           req.body?.id || req.body?.[options.entidad?.toLowerCase() + 'Id'] || 
                           (data?.factura?.id || data?.gasto?.id || data?.cotizacion?.id || 
                            data?.data?.id || data?.factura?._id || data?.gasto?._id || 
                            data?.cotizacion?._id || data?.data?._id) || '';
          
          // Determinar acción
          const accion = options.accion || 
            (req.method === 'POST' ? 'create' : 
             req.method === 'PUT' || req.method === 'PATCH' ? 'update' : 
             req.method === 'DELETE' ? 'delete' : 'view');
          
          // Determinar resultado
          const resultado = statusCode >= 200 && statusCode < 300 ? 'success' : 
                           statusCode >= 400 && statusCode < 500 ? 'warning' : 'error';
          
          // Preparar cambios (solo body para operaciones financieras)
          const cambios = options.registrarCambios !== false ? {
            metodo: req.method,
            url: req.originalUrl,
            ...(options.operacionFinanciera && req.body ? { body: req.body } : {})
          } : null;
          
          // Preparar datos después (solo si fue exitoso)
          let datosDespues = null;
          if (resultado === 'success' && data) {
            datosDespues = data.factura || data.gasto || data.cotizacion || data.data || data;
          }
          
          // Preparar datos de auditoría
          const datosAuditoria = {
            accion,
            entidad: options.entidad || req.path.split('/')[2] || 'Unknown',
            entidadId: String(entidadId),
            usuario: usuarioId,
            empleado: empleadoId,
            cambios,
            datosAntes: datosAntes,
            datosDespues: datosDespues,
            ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '',
            userAgent: req.get('user-agent') || '',
            fecha: new Date(),
            resultado,
            mensaje: data?.mensaje || `${accion} ${options.entidad || 'entidad'}`,
            metadata: {
              statusCode,
              metodo: req.method,
              url: req.originalUrl,
              ...options.metadata
            }
          };

          // Registrar auditoría
          if (options.operacionFinanciera) {
            await AuditoriaModel.registrarOperacionFinanciera({
              ...datosAuditoria,
              campo: options.campo || '',
              valorAnterior: datosAntes?.[options.campo] || null,
              valorNuevo: req.body?.[options.campo] || null
            });
          } else {
            await AuditoriaModel.registrar(datosAuditoria);
          }
        }
      } catch (error) {
        // No interrumpir el flujo si falla la auditoría
        console.error('Error al registrar auditoría:', error);
      }
    };

    // Interceptar res.json
    res.json = async function (data) {
      await registrar(data, res.statusCode);
      return originalJson(data);
    };

    // Interceptar res.send (por si acaso)
    res.send = async function (data) {
      await registrar(data, res.statusCode);
      return originalSend(data);
    };
    
    next();
  };
};

/**
 * Middleware específico para operaciones financieras críticas
 * @param {String} entidad - Nombre de la entidad (ej: 'FacturaCliente', 'Gasto')
 * @param {String} accion - Acción realizada (ej: 'create', 'update', 'delete', 'approve')
 */
export const auditoriaFinanciera = (entidad, accion = 'create') => {
  return registrarAuditoria({
    entidad,
    accion,
    registrarCambios: true,
    operacionFinanciera: true,
    metadata: {
      tipo: 'operacion_financiera',
      criticidad: 'alta'
    }
  });
};

/**
 * Middleware para registrar accesos y vistas
 */
export const registrarAcceso = () => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await AuditoriaModel.registrar({
          accion: 'view',
          entidad: req.path.split('/')[2] || 'Unknown',
          entidadId: req.params.id || '',
          usuario: req.user.id || req.user._id,
          empleado: req.user.empleado?.id || req.user.empleado?._id || null,
          ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '',
          userAgent: req.get('user-agent') || '',
          fecha: new Date(),
          resultado: 'success',
          mensaje: `Acceso a ${req.path}`,
          metadata: {
            metodo: req.method,
            url: req.originalUrl
          }
        });
      }
    } catch (error) {
      console.error('Error al registrar acceso:', error);
    }
    next();
  };
};

/**
 * Función auxiliar para registrar auditoría manualmente
 */
export const registrarAuditoriaManual = async (datos) => {
  try {
    return await AuditoriaModel.registrar(datos);
  } catch (error) {
    console.error('Error al registrar auditoría manual:', error);
    return null;
  }
};

/**
 * Función auxiliar para registrar operaciones financieras manualmente
 */
export const registrarOperacionFinancieraManual = async (datos) => {
  try {
    return await AuditoriaModel.registrarOperacionFinanciera(datos);
  } catch (error) {
    console.error('Error al registrar operación financiera manual:', error);
    return null;
  }
};
