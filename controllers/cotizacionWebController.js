// controllers/cotizacionWebController.js
import CotizacionModel from '../models/CotizacionModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EventoModel from '../models/EventoModel.js';
import ProveedorModel from '../models/ProveedorModel.js';
import ItemCotizacionModel from '../models/ItemCotizacionModel.js';

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
    await CotizacionModel.add(req.body);
    res.redirect('/cotizaciones');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear la cotización' });
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

