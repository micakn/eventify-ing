// controllers/tareaWebController.js
import TareaModel from '../models/TareaModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import EventoModel from '../models/EventoModel.js';

const listTareasWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.estado) filtros.estado = req.query.estado;
    if (req.query.prioridad) filtros.prioridad = req.query.prioridad;
    if (req.query.empleadoAsignado) filtros.empleadoAsignado = req.query.empleadoAsignado;
    if (req.query.eventoAsignado) filtros.eventoAsignado = req.query.eventoAsignado;
    
    let tareas = await TareaModel.getAll(filtros);
    tareas = tareas.map(t => ({ ...t, id: t.id || t._id?.toString() }));
    
    const empleados = await EmpleadoModel.getAll();
    const eventos = await EventoModel.getAll();
    
    res.render('tareas/index', {
      title: 'Tareas - Eventify',
      tareas,
      empleados,
      eventos,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de tareas' });
  }
};

const showNewForm = async (req, res) => {
  try {
    const empleados = await EmpleadoModel.getAll();
    const eventos = await EventoModel.getAll();
    res.render('tareas/form', {
      title: 'Nueva Tarea - Eventify',
      formTitle: 'Nueva Tarea',
      tarea: null,
      formAction: '/tareas',
      empleados,
      eventos
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el formulario' });
  }
};

const showEditForm = async (req, res) => {
  try {
    let tarea = await TareaModel.getById(req.params.id);
    if (!tarea) return res.status(404).render('error', { title: 'Error', message: 'Tarea no encontrada' });
    tarea.id = tarea.id || tarea._id?.toString();
    const empleados = await EmpleadoModel.getAll();
    const eventos = await EventoModel.getAll();
    res.render('tareas/form', {
      title: 'Editar Tarea - Eventify',
      formTitle: 'Editar Tarea',
      tarea,
      formAction: `/tareas/${tarea.id}?_method=PATCH`,
      empleados,
      eventos
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la tarea' });
  }
};

const showTarea = async (req, res) => {
  try {
    let tarea = await TareaModel.getById(req.params.id);
    if (!tarea) return res.status(404).render('error', { title: 'Error', message: 'Tarea no encontrada' });
    tarea.id = tarea.id || tarea._id?.toString();
    res.render('tareas/show', { title: `${tarea.titulo} - Eventify`, tarea });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la tarea' });
  }
};

const createTareaWeb = async (req, res) => {
  try {
    await TareaModel.add(req.body);
    res.redirect('/tareas');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear la tarea' });
  }
};

const updateTareaWeb = async (req, res) => {
  try {
    const actualizada = await TareaModel.update(req.params.id, req.body);
    if (!actualizada) return res.status(404).render('error', { title: 'Error', message: 'Tarea no encontrada' });
    res.redirect('/tareas');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al actualizar la tarea' });
  }
};

const deleteTareaWeb = async (req, res) => {
  try {
    const eliminada = await TareaModel.remove(req.params.id);
    if (!eliminada) return res.status(404).render('error', { title: 'Error', message: 'Tarea no encontrada' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Tarea eliminada', tarea: eliminada });
    }
    res.redirect('/tareas');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar la tarea' });
  }
};

export default {
  listTareasWeb,
  showNewForm,
  showEditForm,
  showTarea,
  createTareaWeb,
  updateTareaWeb,
  deleteTareaWeb
};

