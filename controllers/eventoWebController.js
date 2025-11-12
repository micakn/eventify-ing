// controllers/eventoWebController.js
import EventoModel from '../models/EventoModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';

const listEventosWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.estado) filtros.estado = req.query.estado;
    if (req.query.cliente) filtros.cliente = req.query.cliente;
    
    let eventos = await EventoModel.getAll(filtros);
    eventos = eventos.map(e => ({ ...e, id: e.id || e._id?.toString() }));
    
    const clientes = await ClienteModel.getAll();
    res.render('eventos/index', {
      title: 'Eventos - Eventify',
      eventos,
      clientes,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de eventos' });
  }
};

const showNewForm = async (req, res) => {
  try {
    const clientes = await ClienteModel.getAll();
    const empleados = await EmpleadoModel.getAll();
    res.render('eventos/form', {
      title: 'Nuevo Evento - Eventify',
      formTitle: 'Nuevo Evento',
      evento: null,
      formAction: '/eventos',
      clientes,
      empleados
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el formulario' });
  }
};

const showEditForm = async (req, res) => {
  try {
    let evento = await EventoModel.getById(req.params.id);
    if (!evento) return res.status(404).render('error', { title: 'Error', message: 'Evento no encontrado' });
    evento.id = evento.id || evento._id?.toString();
    const clientes = await ClienteModel.getAll();
    const empleados = await EmpleadoModel.getAll();
    res.render('eventos/form', {
      title: 'Editar Evento - Eventify',
      formTitle: 'Editar Evento',
      evento,
      formAction: `/eventos/${evento.id}?_method=PUT`,
      clientes,
      empleados
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el evento' });
  }
};

const showEvento = async (req, res) => {
  try {
    let evento = await EventoModel.getById(req.params.id);
    if (!evento) return res.status(404).render('error', { title: 'Error', message: 'Evento no encontrado' });
    evento.id = evento.id || evento._id?.toString();
    res.render('eventos/show', { title: `${evento.nombre} - Eventify`, evento });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el evento' });
  }
};

const createEventoWeb = async (req, res) => {
  try {
    if (req.body.responsables && typeof req.body.responsables === 'string') {
      req.body.responsables = [req.body.responsables];
    } else if (!req.body.responsables) {
      req.body.responsables = [];
    }
    await EventoModel.add(req.body);
    res.redirect('/eventos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear el evento' });
  }
};

const updateEventoWeb = async (req, res) => {
  try {
    if (req.body.responsables && typeof req.body.responsables === 'string') {
      req.body.responsables = [req.body.responsables];
    }
    const actualizado = await EventoModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).render('error', { title: 'Error', message: 'Evento no encontrado' });
    res.redirect('/eventos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al actualizar el evento' });
  }
};

const deleteEventoWeb = async (req, res) => {
  try {
    const eliminado = await EventoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).render('error', { title: 'Error', message: 'Evento no encontrado' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Evento eliminado', evento: eliminado });
    }
    res.redirect('/eventos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar el evento' });
  }
};

export default {
  listEventosWeb,
  showNewForm,
  showEditForm,
  showEvento,
  createEventoWeb,
  updateEventoWeb,
  deleteEventoWeb
};

