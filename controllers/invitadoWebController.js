// controllers/invitadoWebController.js
import InvitadoModel from '../models/InvitadoModel.js';
import EventoModel from '../models/EventoModel.js';

const listInvitadosWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.evento) filtros.evento = req.query.evento;
    
    let invitados = await InvitadoModel.getAll(filtros);
    invitados = invitados.map(i => ({ ...i, id: i.id || i._id?.toString() }));
    
    const eventos = await EventoModel.getAll();
    
    res.render('invitados/index', {
      title: 'Invitados - Eventify',
      invitados,
      eventos,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar invitados:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de invitados' });
  }
};

const showNewForm = async (req, res) => {
  try {
    const eventos = await EventoModel.getAll();
    res.render('invitados/form', {
      title: 'Nuevo Invitado - Eventify',
      formTitle: 'Nuevo Invitado',
      invitado: null,
      formAction: '/invitados',
      eventos
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el formulario' });
  }
};

const showInvitado = async (req, res) => {
  try {
    let invitado = await InvitadoModel.getById(req.params.id);
    if (!invitado) return res.status(404).render('error', { title: 'Error', message: 'Invitado no encontrado' });
    invitado.id = invitado.id || invitado._id?.toString();
    res.render('invitados/show', { title: `${invitado.nombre} ${invitado.apellido} - Eventify`, invitado });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el invitado' });
  }
};

const createInvitadoWeb = async (req, res) => {
  try {
    await InvitadoModel.add(req.body);
    res.redirect('/invitados');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear el invitado' });
  }
};

const deleteInvitadoWeb = async (req, res) => {
  try {
    const eliminado = await InvitadoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).render('error', { title: 'Error', message: 'Invitado no encontrado' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Invitado eliminado', invitado: eliminado });
    }
    res.redirect('/invitados');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar el invitado' });
  }
};

export default {
  listInvitadosWeb,
  showNewForm,
  showInvitado,
  createInvitadoWeb,
  deleteInvitadoWeb
};

