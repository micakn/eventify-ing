// controllers/hitoWebController.js
import HitoModel from '../models/HitoModel.js';
import EventoModel from '../models/EventoModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';

const listHitosWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.evento) filtros.evento = req.query.evento;
    if (req.query.estado) filtros.estado = req.query.estado;
    
    let hitos = await HitoModel.getAll(filtros);
    hitos = hitos.map(h => ({ ...h, id: h.id || h._id?.toString() }));
    
    const eventos = await EventoModel.getAll();
    
    res.render('hitos/index', {
      title: 'Hitos - Eventify',
      hitos,
      eventos,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar hitos:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de hitos' });
  }
};

const showNewForm = async (req, res) => {
  try {
    const eventos = await EventoModel.getAll();
    const empleados = await EmpleadoModel.getAll();
    res.render('hitos/form', {
      title: 'Nuevo Hito - Eventify',
      formTitle: 'Nuevo Hito',
      hito: null,
      formAction: '/hitos',
      eventos,
      empleados
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el formulario' });
  }
};

const showHito = async (req, res) => {
  try {
    let hito = await HitoModel.getById(req.params.id);
    if (!hito) return res.status(404).render('error', { title: 'Error', message: 'Hito no encontrado' });
    hito.id = hito.id || hito._id?.toString();
    res.render('hitos/show', { title: `${hito.nombre} - Eventify`, hito });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el hito' });
  }
};

const createHitoWeb = async (req, res) => {
  try {
    await HitoModel.add(req.body);
    res.redirect('/hitos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear el hito' });
  }
};

const deleteHitoWeb = async (req, res) => {
  try {
    const eliminado = await HitoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).render('error', { title: 'Error', message: 'Hito no encontrado' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Hito eliminado', hito: eliminado });
    }
    res.redirect('/hitos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar el hito' });
  }
};

export default {
  listHitosWeb,
  showNewForm,
  showHito,
  createHitoWeb,
  deleteHitoWeb
};

