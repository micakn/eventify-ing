// controllers/auditoriaWebController.js
import AuditoriaModel from '../models/AuditoriaModel.js';

const listAuditoriaWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.entidad) filtros.entidad = req.query.entidad;
    if (req.query.accion) filtros.accion = req.query.accion;
    if (req.query.usuario) filtros.usuario = req.query.usuario;
    if (req.query.fechaDesde) filtros.fechaDesde = req.query.fechaDesde;
    if (req.query.fechaHasta) filtros.fechaHasta = req.query.fechaHasta;
    
    let registros = await AuditoriaModel.getAll(filtros);
    registros = registros.map(r => ({ ...r, id: r.id || r._id?.toString() }));
    
    res.render('auditoria/index', {
      title: 'Auditoría - Eventify',
      registros,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar auditoría:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar los registros de auditoría' });
  }
};

const showAuditoria = async (req, res) => {
  try {
    let registro = await AuditoriaModel.getById(req.params.id);
    if (!registro) return res.status(404).render('error', { title: 'Error', message: 'Registro no encontrado' });
    registro.id = registro.id || registro._id?.toString();
    res.render('auditoria/show', { title: `Registro de Auditoría - Eventify`, registro });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el registro' });
  }
};

export default {
  listAuditoriaWeb,
  showAuditoria
};

