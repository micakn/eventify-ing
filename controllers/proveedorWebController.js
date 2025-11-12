// controllers/proveedorWebController.js
import ProveedorModel from '../models/ProveedorModel.js';

const listProveedoresWeb = async (req, res) => {
  try {
    let proveedores = await ProveedorModel.getAll();
    proveedores = proveedores.map(p => ({ ...p, id: p.id || p._id?.toString() }));
    res.render('proveedores/index', {
      title: 'Proveedores - Eventify',
      proveedores,
      currentPath: req.baseUrl || req.path
    });
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de proveedores' });
  }
};

const showNewForm = (req, res) => {
  res.render('proveedores/form', {
    title: 'Nuevo Proveedor - Eventify',
    formTitle: 'Nuevo Proveedor',
    proveedor: null,
    formAction: '/proveedores'
  });
};

const showEditForm = async (req, res) => {
  try {
    let proveedor = await ProveedorModel.getById(req.params.id);
    if (!proveedor) return res.status(404).render('error', { title: 'Error', message: 'Proveedor no encontrado' });
    proveedor.id = proveedor.id || proveedor._id?.toString();
    res.render('proveedores/form', {
      title: 'Editar Proveedor - Eventify',
      formTitle: 'Editar Proveedor',
      proveedor,
      formAction: `/proveedores/${proveedor.id}?_method=PUT`
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el proveedor' });
  }
};

const showProveedor = async (req, res) => {
  try {
    let proveedor = await ProveedorModel.getById(req.params.id);
    if (!proveedor) return res.status(404).render('error', { title: 'Error', message: 'Proveedor no encontrado' });
    proveedor.id = proveedor.id || proveedor._id?.toString();
    res.render('proveedores/show', { title: `${proveedor.nombre} - Eventify`, proveedor });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar el proveedor' });
  }
};

const createProveedorWeb = async (req, res) => {
  try {
    await ProveedorModel.add(req.body);
    res.redirect('/proveedores');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al crear el proveedor' });
  }
};

const updateProveedorWeb = async (req, res) => {
  try {
    const actualizado = await ProveedorModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).render('error', { title: 'Error', message: 'Proveedor no encontrado' });
    res.redirect('/proveedores');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al actualizar el proveedor' });
  }
};

const deleteProveedorWeb = async (req, res) => {
  try {
    const eliminado = await ProveedorModel.remove(req.params.id);
    if (!eliminado) return res.status(404).render('error', { title: 'Error', message: 'Proveedor no encontrado' });
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensaje: 'Proveedor eliminado', proveedor: eliminado });
    }
    res.redirect('/proveedores');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al eliminar el proveedor' });
  }
};

export default {
  listProveedoresWeb,
  showNewForm,
  showEditForm,
  showProveedor,
  createProveedorWeb,
  updateProveedorWeb,
  deleteProveedorWeb
};

