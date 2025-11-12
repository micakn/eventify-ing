// controllers/facturaWebController.js
import FacturaClienteModel from '../models/FacturaClienteModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EventoModel from '../models/EventoModel.js';

const listFacturasWeb = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.cliente) filtros.cliente = req.query.cliente;
    if (req.query.evento) filtros.evento = req.query.evento;
    if (req.query.estado) filtros.estado = req.query.estado;
    
    let facturas = await FacturaClienteModel.getAll(filtros);
    facturas = facturas.map(f => ({ ...f, id: f.id || f._id?.toString() }));
    
    const clientes = await ClienteModel.getAll();
    const eventos = await EventoModel.getAll();
    
    res.render('facturas/index', {
      title: 'Facturas - Eventify',
      facturas,
      clientes,
      eventos,
      currentPath: req.baseUrl || req.path,
      filtros
    });
  } catch (error) {
    console.error('Error al cargar facturas:', error);
    res.status(500).render('error', { title: 'Error - Eventify', message: 'Error al cargar la lista de facturas' });
  }
};

const showFactura = async (req, res) => {
  try {
    let factura = await FacturaClienteModel.getById(req.params.id);
    if (!factura) return res.status(404).render('error', { title: 'Error', message: 'Factura no encontrada' });
    factura.id = factura.id || factura._id?.toString();
    res.render('facturas/show', { title: `Factura ${factura.numero} - Eventify`, factura });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la factura' });
  }
};

export default {
  listFacturasWeb,
  showFactura
};

