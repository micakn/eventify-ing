// controllers/eventoWebController.js
import EventoModel from '../models/EventoModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';

const EventoWebController = {
    /**
     * Listar todos los eventos desde MongoDB
     */
    async listarEventos(req, res) {
        try {
            const filtros = {};
            if (req.query.estado) filtros.estado = req.query.estado;
            if (req.query.cliente) filtros.cliente = req.query.cliente;
            
            const eventos = await EventoModel.getAll(filtros);
            const clientes = await ClienteModel.getAll();
            
            // Asegurar que los eventos tengan id
            const eventosConId = eventos.map(e => ({ ...e, id: e.id || e._id?.toString() }));
            
            res.render('eventos/index', {
                title: 'Eventos - Eventify',
                eventos: eventosConId,
                clientes,
                currentPath: '/eventos',
                filtros: req.query
            });

        } catch (error) {
            console.error('❌ Error al listar eventos:', error);
            res.status(500).render('error', { 
                title: 'Error - Eventify', 
                message: 'Error al cargar la lista de eventos' 
            });
        }
    },

    /**
     * Mostrar formulario para crear evento
     */
    async mostrarFormularioCrear(req, res) {
        try {
            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);

            res.render('eventos/form', {
                title: 'Nuevo Evento - Eventify',
                formTitle: 'Nuevo Evento',
                evento: null,
                formAction: '/eventos',
                clientes,
                empleados,
                currentPath: '/eventos'
            });
        } catch (error) {
            console.error('Error al mostrar formulario de creación:', error);
            res.redirect('/eventos');
        }
    },

    /**
     * Crear nuevo evento en MongoDB
     */
    async crearEvento(req, res) {
        try {
            if (req.body.responsables && typeof req.body.responsables === 'string') {
                req.body.responsables = [req.body.responsables];
            } else if (!req.body.responsables) {
                req.body.responsables = [];
            }
            
            // Mapear cliente si viene del formulario
            if (req.body.cliente && req.body.cliente !== '') {
                req.body.clienteId = req.body.cliente;
            }
            
            await EventoModel.add(req.body);
            res.redirect('/eventos');
        } catch (error) {
            console.error('Error al crear evento:', error);
            res.status(500).render('error', { 
                title: 'Error', 
                message: 'Error al crear el evento' 
            });
        }
    },

    /**
     * Mostrar formulario para editar evento
     */
    async mostrarFormularioEditar(req, res) {
        try {
            const evento = await EventoModel.getById(req.params.id);
            if (!evento) {
                return res.status(404).render('error', { 
                    title: 'Error', 
                    message: 'Evento no encontrado' 
                });
            }
            
            evento.id = evento.id || evento._id?.toString();
            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);
            
            res.render('eventos/form', {
                title: 'Editar Evento - Eventify',
                formTitle: 'Editar Evento',
                evento,
                formAction: `/eventos/${evento.id}?_method=PUT`,
                clientes,
                empleados,
                currentPath: '/eventos'
            });
        } catch (error) {
            console.error('Error al mostrar formulario de edición:', error);
            res.redirect('/eventos');
        }
    },

    /**
     * Actualizar evento existente en MongoDB
     */
    async actualizarEvento(req, res) {
        try {
            if (req.body.responsables && typeof req.body.responsables === 'string') {
                req.body.responsables = [req.body.responsables];
            }
            
            // Mapear cliente si viene del formulario
            if (req.body.cliente && req.body.cliente !== '') {
                req.body.clienteId = req.body.cliente;
            }
            
            const actualizado = await EventoModel.update(req.params.id, req.body);
            if (!actualizado) {
                return res.status(404).render('error', { 
                    title: 'Error', 
                    message: 'Evento no encontrado' 
                });
            }
            res.redirect('/eventos');
        } catch (error) {
            console.error('Error al actualizar evento:', error);
            res.status(500).render('error', { 
                title: 'Error', 
                message: 'Error al actualizar el evento' 
            });
        }
    },

    /**
     * Eliminar evento de MongoDB
     */
    async eliminarEvento(req, res) {
        try {
            const eliminado = await EventoModel.remove(req.params.id);
            if (!eliminado) {
                return res.status(404).render('error', { 
                    title: 'Error', 
                    message: 'Evento no encontrado' 
                });
            }
            
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.json({ mensaje: 'Evento eliminado', evento: eliminado });
            }
            res.redirect('/eventos');
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            res.status(500).render('error', { 
                title: 'Error', 
                message: 'Error al eliminar el evento' 
            });
        }
    },

    determinarEstado(fechaInicio, fechaFin) {
        if (!fechaInicio) return 'pendiente';
        
        const ahora = new Date();
        const inicio = new Date(fechaInicio);
        const fin = fechaFin ? new Date(fechaFin) : null;
        
        if (fin && fin < ahora) return 'finalizado';
        if (inicio > ahora) return 'pendiente';
        if (inicio <= ahora && (!fin || fin >= ahora)) return 'activo';
        
        return 'activo';
    }
};

export default EventoWebController;
