// -------------------- CONTROLADOR WEB DE CLIENTES --------------------
import ClienteModel from '../models/ClienteModel.js';

/**
 * Listar todos los clientes y renderizar la vista index.pug
 */
const listClientesWeb = async (req, res) => {
  try {
    let clientes = await ClienteModel.getAll();

    // 🔧 Asegurar compatibilidad con MongoDB
    clientes = clientes.map(c => ({ ...c, id: c.id || c._id?.toString() }));

    res.render('clientes/index', {
      title: 'Clientes - Eventify',
      clientes,
      currentPath: req.baseUrl || req.path
    });
  } catch (error) {
    console.error('Error al cargar clientes:', error);
    res
      .status(500)
      .render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de clientes' });
  }
};

/**
 * Mostrar formulario para crear un nuevo cliente
 */
const showNewForm = (req, res) => {
  res.render('clientes/form', {
    title: 'Nuevo Cliente - Eventify',
    formTitle: 'Nuevo Cliente',
    cliente: null,
    formAction: '/clientes'
  });
};

/**
 * Mostrar formulario para editar un cliente existente
 */
const showEditForm = async (req, res) => {
  try {
    let cliente = await ClienteModel.getById(req.params.id);
    if (!cliente)
      return res
        .status(404)
        .render('error', { title: 'Error', message: 'Cliente no encontrado' });

    // 🔧 Asegurar compatibilidad
    cliente.id = cliente.id || cliente._id?.toString();

    res.render('clientes/form', {
      title: 'Editar Cliente - Eventify',
      formTitle: 'Editar Cliente',
      cliente,
      formAction: `/clientes/${cliente.id}?_method=PUT`
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('error', { title: 'Error', message: 'Error al cargar el cliente' });
  }
};

/**
 * Mostrar los detalles de un cliente individual
 */
const showCliente = async (req, res) => {
  try {
    let cliente = await ClienteModel.getById(req.params.id);
    if (!cliente)
      return res
        .status(404)
        .render('error', { title: 'Error', message: 'Cliente no encontrado' });

    cliente.id = cliente.id || cliente._id?.toString();

    res.render('clientes/show', { title: `${cliente.nombre} - Eventify`, cliente });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('error', { title: 'Error', message: 'Error al cargar el cliente' });
  }
};

/**
 * Crear un nuevo cliente (desde formulario web)
 */
const createClienteWeb = async (req, res) => {
  try {
    await ClienteModel.add(req.body);
    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('error', { title: 'Error', message: 'Error al crear el cliente' });
  }
};

/**
 * Actualizar un cliente existente (desde formulario web)
 */
const updateClienteWeb = async (req, res) => {
  try {
    const actualizado = await ClienteModel.update(req.params.id, req.body);
    if (!actualizado)
      return res
        .status(404)
        .render('error', { title: 'Error', message: 'Cliente no encontrado' });

    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('error', { title: 'Error', message: 'Error al actualizar el cliente' });
  }
};

/**
 * Eliminar un cliente (con soporte para AJAX/fetch o redirección normal)
 */
const deleteClienteWeb = async (req, res) => {
  try {
    const eliminado = await ClienteModel.remove(req.params.id);
    if (!eliminado)
      return res
        .status(404)
        .render('error', { title: 'Error', message: 'Cliente no encontrado' });

    // Si la petición viene de fetch/ajax, devolver JSON
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Cliente eliminado', cliente: eliminado });
    }

    // Si es desde formulario clásico, redirigir
    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render('error', { title: 'Error', message: 'Error al eliminar el cliente' });
  }
};

export default {
  listClientesWeb,
  showNewForm,
  showEditForm,
  showCliente,
  createClienteWeb,
  updateClienteWeb,
  deleteClienteWeb
};
