// controllers/gastoWebController.js
import GastoModel from '../models/GastoModel.js';
import EventoModel from '../models/EventoModel.js';
import ProveedorModel from '../models/ProveedorModel.js';

const listGastosWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.evento) filtros.evento = req.query.evento;
    if (req.query.estado) filtros.estado = req.query.estado;
    
    let gastos = await GastoModel.getAll(filtros);
    gastos = gastos.map(g => ({ ...g, id: g.id || g._id?.toString() }));
    
    const eventos = await EventoModel.getAll();
    
    res.render('gastos/index', {
      title: 'Gastos - Eventify',
      gastos,
      eventos,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar gastos:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de gastos' });
  }
};

const showNewForm = async (req, res) => {
  try {
    const eventos = await EventoModel.getAll();
    const proveedores = await ProveedorModel.getAll();
    res.render('gastos/form', {
      title: 'Nuevo Gasto - Eventify',
      formTitle: 'Nuevo Gasto',
      gasto: null,
      formAction: '/gastos',
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
    let gasto = await GastoModel.getById(req.params.id);
    if (!gasto) return res.status(404).render('error', { title: 'Error', message: 'Gasto no encontrado' });
    gasto.id = gasto.id || gasto._id?.toString();
    const eventos = await EventoModel.getAll();
    const proveedores = await ProveedorModel.getAll();
    res.render('gastos/form', {
      title: 'Editar Gasto - Eventify',
      formTitle: 'Editar Gasto',
      gasto,
      formAction: `/gastos/${gasto.id}?_method=PUT`,
      eventos,
      proveedores
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el gasto' });
  }
};

const showGasto = async (req, res) => {
  try {
    let gasto = await GastoModel.getById(req.params.id);
    if (!gasto) return res.status(404).render('error', { title: 'Error', message: 'Gasto no encontrado' });
    gasto.id = gasto.id || gasto._id?.toString();
    res.render('gastos/show', { title: `Gasto ${gasto.numero} - Eventify`, gasto });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el gasto' });
  }
};

const createGastoWeb = async (req, res) => {
  try {
    await GastoModel.add(req.body);
    res.redirect('/gastos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear el gasto' });
  }
};

const updateGastoWeb = async (req, res) => {
  try {
    const actualizado = await GastoModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).render('error', { title: 'Error', message: 'Gasto no encontrado' });
    res.redirect('/gastos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al actualizar el gasto' });
  }
};

const deleteGastoWeb = async (req, res) => {
  try {
    const eliminado = await GastoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).render('error', { title: 'Error', message: 'Gasto no encontrado' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Gasto eliminado', gasto: eliminado });
    }
    res.redirect('/gastos');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar el gasto' });
  }
};

export default {
  listGastosWeb,
  showNewForm,
  showEditForm,
  showGasto,
  createGastoWeb,
  updateGastoWeb,
  deleteGastoWeb
};

