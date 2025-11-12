// controllers/empleadoWebController.js
import EmpleadoModel from '../models/EmpleadoModel.js';

const listEmpleadosWeb = async (req, res) => {
  try {
    let empleados = await EmpleadoModel.getAll();
    empleados = empleados.map(e => ({ ...e, id: e.id || e._id?.toString() }));
    res.render('empleados/index', {
      title: 'Empleados - Eventify',
      empleados,
      currentPath: req.baseUrl || req.path
    });
  } catch (error) {
    console.error('Error al cargar empleados:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de empleados' });
  }
};

const showNewForm = (req, res) => {
  res.render('empleados/form', {
    title: 'Nuevo Empleado - Eventify',
    formTitle: 'Nuevo Empleado',
    empleado: null,
    formAction: '/empleados'
  });
};

const showEditForm = async (req, res) => {
  try {
    let empleado = await EmpleadoModel.getById(req.params.id);
    if (!empleado) return res.status(404).render('error', { title: 'Error', message: 'Empleado no encontrado' });
    empleado.id = empleado.id || empleado._id?.toString();
    res.render('empleados/form', {
      title: 'Editar Empleado - Eventify',
      formTitle: 'Editar Empleado',
      empleado,
      formAction: `/empleados/${empleado.id}?_method=PUT`
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el empleado' });
  }
};

const showEmpleado = async (req, res) => {
  try {
    let empleado = await EmpleadoModel.getById(req.params.id);
    if (!empleado) return res.status(404).render('error', { title: 'Error', message: 'Empleado no encontrado' });
    empleado.id = empleado.id || empleado._id?.toString();
    res.render('empleados/show', { title: `${empleado.nombre} - Eventify`, empleado });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el empleado' });
  }
};

const createEmpleadoWeb = async (req, res) => {
  try {
    await EmpleadoModel.add(req.body);
    res.redirect('/empleados');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear el empleado' });
  }
};

const updateEmpleadoWeb = async (req, res) => {
  try {
    const actualizado = await EmpleadoModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).render('error', { title: 'Error', message: 'Empleado no encontrado' });
    res.redirect('/empleados');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al actualizar el empleado' });
  }
};

const deleteEmpleadoWeb = async (req, res) => {
  try {
    const eliminado = await EmpleadoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).render('error', { title: 'Error', message: 'Empleado no encontrado' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Empleado eliminado', empleado: eliminado });
    }
    res.redirect('/empleados');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar el empleado' });
  }
};

export default {
  listEmpleadosWeb,
  showNewForm,
  showEditForm,
  showEmpleado,
  createEmpleadoWeb,
  updateEmpleadoWeb,
  deleteEmpleadoWeb
};

