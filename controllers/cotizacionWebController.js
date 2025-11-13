// controllers/cotizacionWebController.js
import CotizacionModel from '../models/CotizacionModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EventoModel from '../models/EventoModel.js';
import ProveedorModel from '../models/ProveedorModel.js';
import ItemCotizacionModel from '../models/ItemCotizacionModel.js';
import UsuarioModel from '../models/UsuarioModel.js';

const listCotizacionesWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.cliente) filtros.cliente = req.query.cliente;
    if (req.query.evento) filtros.evento = req.query.evento;
    if (req.query.estado) filtros.estado = req.query.estado;
    
    let cotizaciones = await CotizacionModel.getAll(filtros);
    cotizaciones = cotizaciones.map(c => ({ ...c, id: c.id || c._id?.toString() }));
    
    const clientes = await ClienteModel.getAll();
    const eventos = await EventoModel.getAll();
    
    res.render('cotizaciones/index', {
      title: 'Cotizaciones - Eventify',
      cotizaciones,
      clientes,
      eventos,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar cotizaciones:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de cotizaciones' });
  }
};

const showNewForm = async (req, res) => {
  try {
    const clientes = await ClienteModel.getAll();
    const eventos = await EventoModel.getAll();
    const proveedores = await ProveedorModel.getAll();
    res.render('cotizaciones/form', {
      title: 'Nueva Cotización - Eventify',
      formTitle: 'Nueva Cotización',
      cotizacion: null,
      formAction: '/cotizaciones',
      clientes,
      eventos,
      proveedores
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el formulario' });
  }
};

const showEditForm = async (req, res) => {
  try {
    let cotizacion = await CotizacionModel.getById(req.params.id);
    if (!cotizacion) return res.status(404).render('error', { title: 'Error', message: 'Cotización no encontrada' });
    cotizacion.id = cotizacion.id || cotizacion._id?.toString();
    const clientes = await ClienteModel.getAll();
    const eventos = await EventoModel.getAll();
    const proveedores = await ProveedorModel.getAll();
    const items = await ItemCotizacionModel.getByCotizacion(cotizacion.id);
    res.render('cotizaciones/form', {
      title: 'Editar Cotización - Eventify',
      formTitle: 'Editar Cotización',
      cotizacion,
      formAction: `/cotizaciones/${cotizacion.id}?_method=PUT`,
      clientes,
      eventos,
      proveedores,
      items
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la cotización' });
  }
};

const showCotizacion = async (req, res) => {
  try {
    let cotizacion = await CotizacionModel.getById(req.params.id);
    if (!cotizacion) return res.status(404).render('error', { title: 'Error', message: 'Cotización no encontrada' });
    cotizacion.id = cotizacion.id || cotizacion._id?.toString();
    const items = await ItemCotizacionModel.getByCotizacion(cotizacion.id);
    res.render('cotizaciones/show', { title: `Cotización ${cotizacion.numero} - Eventify`, cotizacion, items });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la cotización' });
  }
};

const createCotizacionWeb = async (req, res) => {
  try {
    // Procesar items si vienen del formulario
    if (req.body.items && typeof req.body.items === 'string') {
      try {
        req.body.items = JSON.parse(req.body.items);
      } catch (e) {
        req.body.items = [];
      }
    }
    
    // Agregar creadoPor desde el usuario autenticado
    if (req.user && req.user.id) {
      req.body.creadoPor = req.user.id;
    } else if (req.user && req.user._id) {
      req.body.creadoPor = req.user._id;
    } else {
      // Si no hay usuario autenticado, buscar un usuario administrador por defecto
      const usuarioAdmin = await UsuarioModel.getByEmail('admin@eventify.com');
      if (usuarioAdmin) {
        req.body.creadoPor = usuarioAdmin.id || usuarioAdmin._id;
      } else {
        // Si no existe, usar el primer usuario disponible
        const usuarios = await UsuarioModel.getAll();
        if (usuarios && usuarios.length > 0) {
          req.body.creadoPor = usuarios[0].id || usuarios[0]._id;
        } else {
          return res.status(400).render('error', { 
            title: 'Error', 
            message: 'No hay usuarios en el sistema. Debe crear un usuario primero.' 
          });
        }
      }
    }
    
    // El número se genera automáticamente si no se proporciona
    const cotizacion = await CotizacionModel.add(req.body);
    if (!cotizacion) {
      return res.status(500).render('error', { 
        title: 'Error', 
        message: 'Error al crear la cotización. Verifique los datos ingresados.' 
      });
    }
    res.redirect('/cotizaciones');
  } catch (error) {
    console.error('Error al crear cotización:', error);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error al crear la cotización: ' + (error.message || 'Error desconocido') 
    });
  }
};

const updateCotizacionWeb = async (req, res) => {
  try {
    if (req.body.items && typeof req.body.items === 'string') {
      try {
        req.body.items = JSON.parse(req.body.items);
      } catch (e) {
        req.body.items = [];
      }
    }
    const actualizada = await CotizacionModel.update(req.params.id, req.body);
    if (!actualizada) return res.status(404).render('error', { title: 'Error', message: 'Cotización no encontrada' });
    res.redirect('/cotizaciones');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al actualizar la cotización' });
  }
};

const deleteCotizacionWeb = async (req, res) => {
  try {
    const eliminada = await CotizacionModel.remove(req.params.id);
    if (!eliminada) return res.status(404).render('error', { title: 'Error', message: 'Cotización no encontrada' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Cotización eliminada', cotizacion: eliminada });
    }
    res.redirect('/cotizaciones');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar la cotización' });
  }
};

export default {
  listCotizacionesWeb,
  showNewForm,
  showEditForm,
  showCotizacion,
  createCotizacionWeb,
  updateCotizacionWeb,
  deleteCotizacionWeb
};

