// seed.js
// -------------------- SEED - CARGA INICIAL DE DATOS --------------------
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongo, disconnectMongo } from './db/mongoose.js';
import bcrypt from 'bcrypt';

// Importar modelos
import ClienteModel from './models/ClienteModel.js';
import EmpleadoModel from './models/EmpleadoModel.js';
import EventoModel from './models/EventoModel.js';
import TareaModel from './models/TareaModel.js';
import UsuarioModel from './models/UsuarioModel.js';
import ProveedorModel from './models/ProveedorModel.js';
import CotizacionModel from './models/CotizacionModel.js';
import ItemCotizacionModel from './models/ItemCotizacionModel.js';
import InvitadoModel from './models/InvitadoModel.js';
import InvitacionModel from './models/InvitacionModel.js';
import HitoModel from './models/HitoModel.js';
import GastoModel from './models/GastoModel.js';
import FacturaClienteModel from './models/FacturaClienteModel.js';
import ItemFacturaModel from './models/ItemFacturaModel.js';

dotenv.config();

// -------------------- DATOS DE SEMILLA --------------------

// Clientes (6-8 clientes)
const clientesSeed = [
  {
    nombre: 'Vitalia S.A.',
    email: 'contacto@vitalia.com',
    telefono: '+5491122334455',
    empresa: 'Vitalia',
    notas: 'Cliente corporativo del sector salud, eventos médicos y conferencias'
  },
  {
    nombre: 'Club Deportivo El Molino',
    email: 'clubelmolino@gmail.com',
    telefono: '+5491166677788',
    empresa: 'Club El Molino',
    notas: 'Cliente institucional con eventos anuales, torneos y celebraciones'
  },
  {
    nombre: 'Cultura Viva ONG',
    email: 'info@culturaviva.org',
    telefono: '+5491155522233',
    empresa: 'Cultura Viva',
    notas: 'Organización sin fines de lucro, eventos culturales y artísticos'
  },
  {
    nombre: 'Innovar S.R.L.',
    email: 'proyectos@innovar.com',
    telefono: '+5491188899911',
    empresa: 'Innovar',
    notas: 'Empresa tecnológica que organiza workshops mensuales y hackathons'
  },
  {
    nombre: 'Global Tech Solutions',
    email: 'eventos@globaltech.com',
    telefono: '+5491199988877',
    empresa: 'Global Tech',
    notas: 'Empresa multinacional, eventos corporativos y lanzamientos de productos'
  },
  {
    nombre: 'Universidad Nacional',
    email: 'extension@universidad.edu.ar',
    telefono: '+5491144455566',
    empresa: 'Universidad Nacional',
    notas: 'Institución educativa, congresos y jornadas académicas'
  },
  {
    nombre: 'Festival de Cine Independiente',
    email: 'info@festivalcine.com',
    telefono: '+5491177788899',
    empresa: 'Festival Cine',
    notas: 'Evento cultural anual, proyecciones y premiaciones'
  },
  {
    nombre: 'Startup Weekend Buenos Aires',
    email: 'organizacion@startupweekend.com',
    telefono: '+5491133366677',
    empresa: 'Startup Weekend',
    notas: 'Evento de emprendimiento, hackathons y competencias'
  }
];

// Empleados (30 empleados - según requerimientos de Ingeniería de Software)
const empleadosSeed = [
  // Administradores (4)
  {
    nombre: 'Alex López',
    rol: 'administrador',
    area: 'Administración',
    email: 'alex.lopez@eventify.com',
    telefono: '+5491122233344'
  },
  {
    nombre: 'María García',
    rol: 'administrador',
    area: 'Administración',
    email: 'maria.garcia@eventify.com',
    telefono: '+5491133344455'
  },
  {
    nombre: 'Pedro Sánchez',
    rol: 'administrador',
    area: 'Administración',
    email: 'pedro.sanchez@eventify.com',
    telefono: '+5491144455566'
  },
  {
    nombre: 'Carmen Ruiz',
    rol: 'administrador',
    area: 'Administración',
    email: 'carmen.ruiz@eventify.com',
    telefono: '+5491155566677'
  },
  // Planners - Planificación y Finanzas (11)
  {
    nombre: 'Sofía Ramírez',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'sofia.ramirez@eventify.com',
    telefono: '+5491166677788'
  },
  {
    nombre: 'Carlos Mendoza',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'carlos.mendoza@eventify.com',
    telefono: '+5491177788899'
  },
  {
    nombre: 'Ana Fernández',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'ana.fernandez@eventify.com',
    telefono: '+5491188899900'
  },
  {
    nombre: 'Roberto Jiménez',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'roberto.jimenez@eventify.com',
    telefono: '+5491199900011'
  },
  {
    nombre: 'Isabel Morales',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'isabel.morales@eventify.com',
    telefono: '+5491100011122'
  },
  {
    nombre: 'Fernando Castro',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'fernando.castro@eventify.com',
    telefono: '+5491111122233'
  },
  {
    nombre: 'Patricia Vargas',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'patricia.vargas@eventify.com',
    telefono: '+5491322233344'
  },
  {
    nombre: 'Ricardo Silva',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'ricardo.silva@eventify.com',
    telefono: '+5491333344455'
  },
  // Coordinadores - Producción y Logística (10)
  {
    nombre: 'Juan González',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'juan.gonzalez@eventify.com',
    telefono: '+5491344455566'
  },
  {
    nombre: 'Gonzalo Pérez',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'gonzalo.perez@eventify.com',
    telefono: '+5491355566677'
  },
  {
    nombre: 'Laura Martínez',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'laura.martinez@eventify.com',
    telefono: '+5491366677788'
  },
  {
    nombre: 'Diego Rodríguez',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'diego.rodriguez@eventify.com',
    telefono: '+5491377788899'
  },
  {
    nombre: 'Martín Ríos',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'martin.rios@eventify.com',
    telefono: '+5491388899900'
  },
  {
    nombre: 'Andrea Flores',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'andrea.flores@eventify.com',
    telefono: '+5491399900011'
  },
  {
    nombre: 'Sebastián Moreno',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'sebastian.moreno@eventify.com',
    telefono: '+5491400011122'
  },
  {
    nombre: 'Natalia Cruz',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'natalia.cruz@eventify.com',
    telefono: '+5491411122233'
  },
  {
    nombre: 'Gabriel Ortiz',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'gabriel.ortiz@eventify.com',
    telefono: '+5491422233344'
  },
  {
    nombre: 'Camila Álvarez',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'camila.alvarez@eventify.com',
    telefono: '+5491433344455'
  },
  // Atención al Cliente (5)
  {
    nombre: 'Valentina Sánchez',
    rol: 'planner',
    area: 'Atención al Cliente',
    email: 'valentina.sanchez@eventify.com',
    telefono: '+5491244455566'
  },
  {
    nombre: 'Roberto Torres',
    rol: 'coordinador',
    area: 'Atención al Cliente',
    email: 'roberto.torres@eventify.com',
    telefono: '+5491255566677'
  },
  {
    nombre: 'Lucía Herrera',
    rol: 'planner',
    area: 'Atención al Cliente',
    email: 'lucia.herrera@eventify.com',
    telefono: '+5491266677788'
  },
  {
    nombre: 'Javier Molina',
    rol: 'coordinador',
    area: 'Atención al Cliente',
    email: 'javier.molina@eventify.com',
    telefono: '+5491277788899'
  },
  {
    nombre: 'Daniela Romero',
    rol: 'planner',
    area: 'Atención al Cliente',
    email: 'daniela.romero@eventify.com',
    telefono: '+5491288899900'
  },
  // Planificación y Finanzas - Continuación (3 adicionales)
  {
    nombre: 'Elena Díaz',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'elena.diaz@eventify.com',
    telefono: '+5491444455566'
  },
  {
    nombre: 'Andrés Gutiérrez',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'andres.gutierrez@eventify.com',
    telefono: '+5491455566677'
  },
  {
    nombre: 'Mariana López',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'mariana.lopez@eventify.com',
    telefono: '+5491466677788'
  }
];

// Eventos (8 eventos con diferentes estados)
const eventosSeed = [
  {
    nombre: 'Festival de Innovación 2025',
    descripcion: 'Evento anual con charlas, talleres y networking para emprendedores',
    lugar: 'Centro de Convenciones Buenos Aires',
    fechaInicio: new Date('2025-11-10T09:00:00'),
    fechaFin: new Date('2025-11-12T18:00:00'),
    presupuesto: 500000,
    estado: 'planificacion'
  },
  {
    nombre: 'Presentación App Eventify',
    descripcion: 'Lanzamiento del sistema de gestión Eventify para la industria de eventos',
    lugar: 'Auditorio Principal - Hotel Sheraton',
    fechaInicio: new Date('2025-12-01T10:00:00'),
    fechaFin: new Date('2025-12-01T14:00:00'),
    presupuesto: 150000,
    estado: 'planificacion'
  },
  {
    nombre: 'Expo Emprendedores 2025',
    descripcion: 'Feria de emprendimientos y rondas de inversión',
    lugar: 'Parque Tecnológico Buenos Aires',
    fechaInicio: new Date('2025-09-15T08:00:00'),
    fechaFin: new Date('2025-09-18T20:00:00'),
    presupuesto: 800000,
    estado: 'en_curso'
  },
  {
    nombre: 'Foro de Software Libre',
    descripcion: 'Charlas y paneles sobre código abierto y colaboración',
    lugar: 'Centro Cultural San Martín',
    fechaInicio: new Date('2025-08-22T09:00:00'),
    fechaFin: new Date('2025-08-23T18:00:00'),
    presupuesto: 300000,
    estado: 'ejecutado'
  },
  {
    nombre: 'Congreso de Medicina 2025',
    descripcion: 'Congreso internacional de medicina con expositores internacionales',
    lugar: 'Centro de Convenciones Córdoba',
    fechaInicio: new Date('2025-10-05T08:00:00'),
    fechaFin: new Date('2025-10-07T20:00:00'),
    presupuesto: 1200000,
    estado: 'planificacion'
  },
  {
    nombre: 'Workshop de Desarrollo Web',
    descripcion: 'Taller intensivo de desarrollo web con tecnologías modernas',
    lugar: 'Campus Universitario',
    fechaInicio: new Date('2025-07-20T09:00:00'),
    fechaFin: new Date('2025-07-20T17:00:00'),
    presupuesto: 80000,
    estado: 'cerrado'
  },
  {
    nombre: 'Festival de Música Indie',
    descripcion: 'Festival de música independiente con bandas locales',
    lugar: 'Parque Central',
    fechaInicio: new Date('2025-06-15T14:00:00'),
    fechaFin: new Date('2025-06-15T23:00:00'),
    presupuesto: 400000,
    estado: 'ejecutado'
  },
  {
    nombre: 'Hackathon Fintech 2025',
    descripcion: 'Competencia de desarrollo de soluciones financieras',
    lugar: 'Campus Tecnológico',
    fechaInicio: new Date('2025-05-10T08:00:00'),
    fechaFin: new Date('2025-05-12T20:00:00'),
    presupuesto: 250000,
    estado: 'cerrado'
  }
];

// Proveedores (12 proveedores)
const proveedoresSeed = [
  {
    nombre: 'Catering Premium S.A.',
    contacto: {
      nombre: 'Roberto Martínez',
      email: 'ventas@cateringpremium.com',
      telefono: '+5491111122233'
    },
    servicios: ['Catering', 'Bartenders', 'Servicio de mesa'],
    condicionImpositiva: 'Responsable Inscripto',
    CUIT: '20-12345678-9',
    direccion: 'Av. Libertador 1234, CABA',
    activo: true,
    notas: 'Proveedor principal de catering para eventos corporativos'
  },
  {
    nombre: 'Sonido Pro Eventos',
    contacto: {
      nombre: 'Pedro González',
      email: 'contacto@sonidopro.com',
      telefono: '+5491122233344'
    },
    servicios: ['Sonido', 'Iluminación', 'Equipos audiovisuales'],
    condicionImpositiva: 'Responsable Inscripto',
    CUIT: '20-23456789-0',
    direccion: 'Av. Corrientes 5678, CABA',
    activo: true,
    notas: 'Equipos de sonido profesional para eventos'
  },
  {
    nombre: 'Decoración Creativa',
    contacto: {
      nombre: 'Laura Fernández',
      email: 'info@decoracioncreativa.com',
      telefono: '+5491133344455'
    },
    servicios: ['Decoración', 'Florería', 'Mobiliario'],
    condicionImpositiva: 'Monotributo',
    CUIT: '27-34567890-1',
    direccion: 'Av. Santa Fe 9012, CABA',
    activo: true,
    notas: 'Decoración personalizada para eventos'
  },
  {
    nombre: 'Logística Express',
    contacto: {
      nombre: 'Carlos Rodríguez',
      email: 'servicios@logisticaexpress.com',
      telefono: '+5491144455566'
    },
    servicios: ['Transporte', 'Montaje', 'Desmontaje'],
    condicionImpositiva: 'Responsable Inscripto',
    CUIT: '20-45678901-2',
    direccion: 'Av. Córdoba 3456, CABA',
    activo: true,
    notas: 'Servicios de logística y transporte'
  },
  {
    nombre: 'Fotografía Profesional',
    contacto: {
      nombre: 'Ana Martínez',
      email: 'fotos@fotoprofesional.com',
      telefono: '+5491155566677'
    },
    servicios: ['Fotografía', 'Video', 'Dron'],
    condicionImpositiva: 'Monotributo',
    CUIT: '27-56789012-3',
    direccion: 'Av. Cabildo 7890, CABA',
    activo: true,
    notas: 'Servicios de fotografía y video profesional'
  },
  {
    nombre: 'Iluminación Artística',
    contacto: {
      nombre: 'Diego Sánchez',
      email: 'ventas@iluminacionartistica.com',
      telefono: '+5491166677788'
    },
    servicios: ['Iluminación', 'Efectos especiales', 'Laser'],
    condicionImpositiva: 'Responsable Inscripto',
    CUIT: '20-67890123-4',
    direccion: 'Av. Rivadavia 1234, CABA',
    activo: true,
    notas: 'Iluminación artística y efectos especiales'
  },
  {
    nombre: 'Seguridad Eventos',
    contacto: {
      nombre: 'Miguel Torres',
      email: 'seguridad@eventos.com',
      telefono: '+5491177788899'
    },
    servicios: ['Seguridad', 'Vigilancia', 'Control de acceso'],
    condicionImpositiva: 'Responsable Inscripto',
    CUIT: '20-78901234-5',
    direccion: 'Av. Belgrano 5678, CABA',
    activo: true,
    notas: 'Servicios de seguridad para eventos'
  },
  {
    nombre: 'Impresión Digital',
    contacto: {
      nombre: 'Patricia López',
      email: 'impresion@digital.com',
      telefono: '+5491188899900'
    },
    servicios: ['Impresión', 'Gigantografías', 'Señalética'],
    condicionImpositiva: 'Monotributo',
    CUIT: '27-89012345-6',
    direccion: 'Av. Jujuy 9012, CABA',
    activo: true,
    notas: 'Impresión digital y señalética'
  },
  {
    nombre: 'Alquiler de Mobiliario',
    contacto: {
      nombre: 'Fernando Herrera',
      email: 'alquiler@mobiliario.com',
      telefono: '+5491199900011'
    },
    servicios: ['Mobiliario', 'Sillas', 'Mesas', 'Carpas'],
    condicionImpositiva: 'Responsable Inscripto',
    CUIT: '20-90123456-7',
    direccion: 'Av. San Martín 3456, CABA',
    activo: true,
    notas: 'Alquiler de mobiliario para eventos'
  },
  {
    nombre: 'Animación y Entretenimiento',
    contacto: {
      nombre: 'Gabriela Morales',
      email: 'animacion@entretenimiento.com',
      telefono: '+5491100011122'
    },
    servicios: ['Animación', 'DJ', 'Show en vivo'],
    condicionImpositiva: 'Monotributo',
    CUIT: '27-01234567-8',
    direccion: 'Av. Córdoba 7890, CABA',
    activo: true,
    notas: 'Servicios de animación y entretenimiento'
  },
  {
    nombre: 'Traducción Simultánea',
    contacto: {
      nombre: 'María Silva',
      email: 'traduccion@simultanea.com',
      telefono: '+5491111122233'
    },
    servicios: ['Traducción', 'Interpretación', 'Equipos de traducción'],
    condicionImpositiva: 'Monotributo',
    CUIT: '27-12345678-9',
    direccion: 'Av. Libertador 5678, CABA',
    activo: true,
    notas: 'Servicios de traducción simultánea'
  },
  {
    nombre: 'Wifi y Conectividad',
    contacto: {
      nombre: 'Javier Ruiz',
      email: 'wifi@conectividad.com',
      telefono: '+5491122233344'
    },
    servicios: ['Internet', 'Wifi', 'Conectividad', 'Streaming'],
    condicionImpositiva: 'Responsable Inscripto',
    CUIT: '20-23456789-0',
    direccion: 'Av. Corrientes 9012, CABA',
    activo: true,
    notas: 'Servicios de internet y conectividad'
  }
];

// -------------------- FUNCIÓN PRINCIPAL --------------------
async function seedDB() {
  try {
    await connectMongo(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
    console.log('🧹 Limpiando base de datos...');

    // Limpiar todas las colecciones
    await Promise.all([
      mongoose.connection.collection('clientes').deleteMany({}),
      mongoose.connection.collection('empleados').deleteMany({}),
      mongoose.connection.collection('eventos').deleteMany({}),
      mongoose.connection.collection('tareas').deleteMany({}),
      mongoose.connection.collection('usuarios').deleteMany({}),
      mongoose.connection.collection('proveedores').deleteMany({}),
      mongoose.connection.collection('cotizaciones').deleteMany({}),
      mongoose.connection.collection('itemcotizaciones').deleteMany({}),
      mongoose.connection.collection('invitados').deleteMany({}),
      mongoose.connection.collection('invitaciones').deleteMany({}),
      mongoose.connection.collection('hitos').deleteMany({}),
      mongoose.connection.collection('gastos').deleteMany({}),
      mongoose.connection.collection('facturaclientes').deleteMany({}),
      mongoose.connection.collection('itemfacturas').deleteMany({}),
      mongoose.connection.collection('auditorias').deleteMany({})
    ]);

    console.log('📥 Insertando datos base...');

    // 1. Insertar Clientes
    const clientes = [];
    for (const clienteData of clientesSeed) {
      const cliente = await ClienteModel.add(clienteData);
      if (cliente) clientes.push(cliente);
    }
    console.log(`✅ ${clientes.length} clientes creados`);

    // 2. Insertar Empleados
    const empleados = [];
    for (const empleadoData of empleadosSeed) {
      const empleado = await EmpleadoModel.add(empleadoData);
      if (empleado) empleados.push(empleado);
    }
    console.log(`✅ ${empleados.length} empleados creados`);

    // 3. Crear Usuarios (vinculados a empleados)
    const usuarios = [];
    const rolesUsuario = ['administrador', 'productor', 'financiero', 'diseñador'];
    
    // Mapear roles de empleado a roles de usuario
    const mapeoRoles = {
      'administrador': 'administrador',
      'planner': 'financiero',
      'coordinador': 'productor'
    };

    for (let i = 0; i < empleados.length; i++) {
      const empleado = empleados[i];
      const rolUsuario = mapeoRoles[empleado.rol] || 'productor';
      
      const usuario = await UsuarioModel.add({
        email: empleado.email,
        password: 'password123', // Se hasheará automáticamente
        rol: rolUsuario,
        empleado: empleado.id,
        activo: true
      });
      if (usuario) usuarios.push(usuario);
    }
    console.log(`✅ ${usuarios.length} usuarios creados`);

    // 4. Insertar Eventos (con clientes y responsables)
    const eventos = [];
    for (let i = 0; i < eventosSeed.length; i++) {
      const eventoData = eventosSeed[i];
      const clienteIndex = i % clientes.length;
      const responsableIndex1 = i % empleados.length;
      const responsableIndex2 = (i + 1) % empleados.length;
      
      const evento = await EventoModel.add({
        ...eventoData,
        cliente: clientes[clienteIndex].id,
        responsables: [empleados[responsableIndex1].id, empleados[responsableIndex2].id]
      });
      if (evento) eventos.push(evento);
    }
    console.log(`✅ ${eventos.length} eventos creados`);

    // 5. Insertar Proveedores
    const proveedores = [];
    for (const proveedorData of proveedoresSeed) {
      const proveedor = await ProveedorModel.add(proveedorData);
      if (proveedor) proveedores.push(proveedor);
    }
    console.log(`✅ ${proveedores.length} proveedores creados`);

    // 6. Crear Cotizaciones con Items
    const cotizaciones = [];
    for (let i = 0; i < 4; i++) {
      const evento = eventos[i];
      const cliente = clientes[i % clientes.length];
      const usuario = usuarios[i % usuarios.length];
      
      // Generar número de cotización
      const año = new Date().getFullYear();
      const numeroCotizacion = `COT-${año}-${String(i + 1).padStart(4, '0')}`;
      
      // Crear cotización (createdAt se establece automáticamente como fecha de emisión)
      // Fechas relativas: cotizaciones creadas hace diferentes días
      const diasAtras = i * 7; // 0, 7, 14, 21 días atrás
      const fechaBase = new Date(Date.now() - (diasAtras * 24 * 60 * 60 * 1000));
      
      const cotizacion = await CotizacionModel.add({
        numero: numeroCotizacion,
        cliente: cliente.id,
        evento: evento.id,
        margenPorcentaje: 25 + (i * 5), // 25%, 30%, 35%, 40%
        estado: i === 0 ? 'borrador' : i === 1 ? 'pendiente' : i === 2 ? 'aprobada' : 'pendiente',
        version: 1,
        fechaEnvio: i > 0 ? new Date(fechaBase.getTime() + (2 * 24 * 60 * 60 * 1000)) : null, // Enviada 2 días después de crear
        fechaVencimiento: new Date(fechaBase.getTime() + (30 * 24 * 60 * 60 * 1000)), // 30 días después de crear
        fechaAprobacion: i === 2 ? new Date(fechaBase.getTime() + (5 * 24 * 60 * 60 * 1000)) : null, // Aprobada 5 días después de crear
        creadoPor: usuario.id,
        aprobadoPor: i === 2 ? usuario.id : null,
        observaciones: `Cotización para ${evento.nombre}`
      });

      if (cotizacion) {
        // Crear items de cotización
        const itemsCotizacion = [];
        const categorias = ['Catering', 'Sonido', 'Iluminación', 'Decoración', 'Logística'];
        
        for (let j = 0; j < 3; j++) {
          // Usar diferentes proveedores para cada item
          const proveedorIndex = (i * 3 + j) % proveedores.length;
          const proveedor = proveedores[proveedorIndex];
          const categoria = categorias[j % categorias.length];
          const cantidad = 10 + (j * 5);
          const precioUnitario = 1000 + (j * 500) + (i * 100); // Variar precio por cotización
          
          const item = await ItemCotizacionModel.add({
            cotizacion: cotizacion.id,
            proveedor: proveedor.id,
            descripcion: `${categoria} para ${evento.nombre}`,
            categoria: categoria,
            cantidad: cantidad,
            unidad: 'unidad',
            precioUnitario: precioUnitario,
            observaciones: `Item ${j + 1} de cotización ${cotizacion.numero}`
          });
          
          if (item) itemsCotizacion.push(item.id);
        }
        
        // Actualizar cotización con items
        await CotizacionModel.update(cotizacion.id, {
          items: itemsCotizacion
        });
        
        // Recalcular totales
        await CotizacionModel.recalcularTotales(cotizacion.id);
        const cotizacionCompleta = await CotizacionModel.getById(cotizacion.id);
        cotizaciones.push(cotizacionCompleta);
      }
    }
    console.log(`✅ ${cotizaciones.length} cotizaciones creadas con items`);

    // 7. Crear Gastos
    const gastos = [];
    const estadosGasto = ['pendiente', 'pagado', 'pendiente', 'pagado', 'cancelado'];
    const metodosPago = ['transferencia', 'cheque', 'efectivo', 'tarjeta'];
    for (let i = 0; i < 20; i++) {
      const evento = eventos[i % eventos.length];
      const proveedor = proveedores[i % proveedores.length];
      const categorias = ['Catering', 'Sonido', 'Iluminación', 'Decoración', 'Logística', 'Otros'];
      const categoria = categorias[i % categorias.length];
      const monto = 5000 + (i * 1000);
      const iva = monto * 0.21;
      const total = monto + iva;
      const estado = estadosGasto[i % estadosGasto.length];
      const metodoPago = metodosPago[i % metodosPago.length];
      
      // Algunos gastos pueden estar relacionados con cotizaciones
      const cotizacionRelacionada = i < cotizaciones.length ? cotizaciones[i] : null;
      // Usar el empleado asociado al usuario (los usuarios se crean en el mismo orden que los empleados)
      const empleadoAprobador = empleados[i % empleados.length];
      
      const fechaGasto = new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)); // Hace i semanas
      const fechaVencimiento = estado === 'pendiente' ? new Date(fechaGasto.getTime() + (30 - i * 2) * 24 * 60 * 60 * 1000) : null;
      
      const gasto = await GastoModel.add({
        numero: `GAS-2025-${String(i + 1).padStart(4, '0')}`,
        evento: evento.id,
        proveedor: proveedor.id,
        cotizacion: cotizacionRelacionada?.id || null,
        descripcion: `Gasto de ${categoria} para ${evento.nombre}`,
        categoria: categoria,
        monto: monto,
        iva: iva,
        total: total,
        fecha: fechaGasto,
        fechaVencimiento: fechaVencimiento,
        estado: estado,
        metodoPago: metodoPago,
        numeroFactura: estado === 'pagado' ? `FAC-PROV-${String(i + 1).padStart(6, '0')}` : '',
        aprobadoPor: estado === 'pagado' ? empleadoAprobador.id : null,
        fechaAprobacion: estado === 'pagado' ? new Date(fechaGasto.getTime() + 24 * 60 * 60 * 1000) : null,
        notas: `Gasto ${i + 1} registrado para ${evento.nombre}`
      });
      
      if (gasto) gastos.push(gasto);
    }
    console.log(`✅ ${gastos.length} gastos creados`);

    // 8. Crear Facturas
    const facturas = [];
    for (let i = 0; i < 3; i++) {
      const evento = eventos[i];
      const cliente = clientes[i % clientes.length];
      const cotizacion = cotizaciones[i];
      
      const año = new Date().getFullYear();
      const numeroFactura = `FC-${año}-${String(i + 1).padStart(6, '0')}`;
      
      // Crear factura (fechas coherentes con cotizaciones y eventos)
      const diasAtrasFactura = (i + 1) * 10; // 10, 20, 30 días atrás
      const fechaEmisionFactura = new Date(Date.now() - (diasAtrasFactura * 24 * 60 * 60 * 1000));
      const fechaVencimientoFactura = new Date(fechaEmisionFactura.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días después
      const fechaPagoFactura = i === 2 ? new Date(fechaEmisionFactura.getTime() + (15 * 24 * 60 * 60 * 1000)) : null; // Pagada 15 días después
      
      const factura = await FacturaClienteModel.add({
        numero: numeroFactura,
        cliente: cliente.id,
        evento: evento.id,
        cotizacion: cotizacion?.id || null,
        subtotal: cotizacion?.subtotal || 100000,
        iva: cotizacion?.iva || 21000,
        total: cotizacion?.total || 121000,
        margenPorcentaje: 25,
        margenMonto: cotizacion?.margenMonto || 25000,
        fechaEmision: fechaEmisionFactura,
        fechaVencimiento: fechaVencimientoFactura,
        fechaPago: fechaPagoFactura,
        estado: i === 0 ? 'borrador' : i === 1 ? 'enviada' : 'pagada',
        metodoPago: 'transferencia',
        condicionImpositiva: 'Responsable Inscripto',
        notas: `Factura para ${evento.nombre}`
      });

      if (factura) {
        // Crear items de factura si hay cotización
        if (cotizacion && cotizacion.items && cotizacion.items.length > 0) {
          const itemsFactura = [];
          for (let j = 0; j < cotizacion.items.length; j++) {
            const itemCotId = cotizacion.items[j];
            const itemCot = await ItemCotizacionModel.getById(itemCotId);
            if (itemCot) {
              const subtotal = itemCot.subtotal || (itemCot.cantidad * itemCot.precioUnitario);
              const iva = subtotal * 0.21;
              const total = subtotal + iva;
              
              const itemFact = await ItemFacturaModel.add({
                factura: factura.id,
                descripcion: itemCot.descripcion,
                categoria: itemCot.categoria || 'Otros',
                cantidad: itemCot.cantidad,
                precioUnitario: itemCot.precioUnitario,
                subtotal: subtotal,
                iva: iva,
                total: total,
                orden: j + 1
              });
              if (itemFact) itemsFactura.push(itemFact.id);
            }
          }
          
          // Actualizar factura con items y recalcular totales
          if (itemsFactura.length > 0) {
            await FacturaClienteModel.update(factura.id, {
              items: itemsFactura
            });
            // Recalcular totales
            await FacturaClienteModel.recalcularTotal(factura.id);
          }
        }
        
        const facturaCompleta = await FacturaClienteModel.getById(factura.id);
        facturas.push(facturaCompleta);
      }
    }
    console.log(`✅ ${facturas.length} facturas creadas`);

    // 9. Crear Invitados e Invitaciones
    const invitados = [];
    const nombresInvitados = [
      'Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofía',
      'Roberto', 'Valentina', 'Fernando', 'Lucía', 'Miguel', 'Patricia', 'Javier',
      'Gabriela', 'Alejandro', 'Camila', 'Ricardo', 'Natalia', 'Andrés', 'Carolina',
      'Sergio', 'Daniela', 'Martín', 'Florencia', 'Pablo', 'Julieta', 'Gustavo', 'Romina',
      'Eduardo', 'Agustina', 'Hernán', 'Bárbara', 'Federico', 'Isabella', 'Nicolás', 'Antonella',
      'Sebastián', 'Martina', 'Facundo', 'Milagros', 'Matías', 'Victoria', 'Tomás', 'Olivia'
    ];
    const apellidosInvitados = [
      'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez',
      'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Ortiz', 'Gutiérrez',
      'Chávez', 'Ramos', 'Mendoza', 'Herrera', 'Jiménez', 'Moreno', 'Álvarez', 'Ruiz', 'Vargas'
    ];
    
    for (let i = 0; i < 40; i++) {
      const evento = eventos[i % eventos.length];
      const nombre = nombresInvitados[i % nombresInvitados.length];
      const apellido = apellidosInvitados[i % apellidosInvitados.length];
      const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@email.com`;
      
      const invitado = await InvitadoModel.add({
        nombre: nombre,
        apellido: apellido,
        email: email,
        telefono: `+54911${String(30000000 + i).padStart(8, '0')}`,
        evento: evento.id,
        categoria: i < 5 ? 'VIP' : i < 15 ? 'Estándar' : i < 25 ? 'Staff' : 'Prensa',
        estadoRSVP: i < 10 ? 'confirmado' : i < 20 ? 'pendiente' : i < 30 ? 'rechazado' : 'talvez',
        notas: `Invitado ${i + 1} para ${evento.nombre}`
      });
      
      if (invitado) {
        // Crear invitación (enlaceUnico se genera automáticamente en pre-save)
        try {
          const invitacion = await InvitacionModel.add({
            invitado: invitado.id,
            evento: evento.id,
            fechaEnvio: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)),
            expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
          });
          
          // Actualizar invitación con estado y respuesta si corresponde
          if (invitacion && invitado.estadoRSVP !== 'pendiente') {
            await InvitacionModel.update(invitacion.id, {
              estado: 'respondida',
              respuesta: invitado.estadoRSVP === 'confirmado' ? 'confirmado' : 
                         invitado.estadoRSVP === 'rechazado' ? 'rechazado' : 
                         invitado.estadoRSVP === 'talvez' ? 'talvez' : null,
              fechaRespuesta: new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
            });
          }
        } catch (error) {
          console.error(`Error al crear invitación para invitado ${invitado.id}:`, error.message);
        }
        invitados.push(invitado);
      }
    }
    console.log(`✅ ${invitados.length} invitados creados con invitaciones`);

    // 10. Crear Hitos
    const hitos = [];
    const tiposHito = ['reunion', 'tarea', 'hito', 'revision', 'entrega'];
    const estadosHito = ['pendiente', 'en_progreso', 'completado', 'atrasado'];
    for (let i = 0; i < 20; i++) {
      const evento = eventos[i % eventos.length];
      const responsable = empleados[i % empleados.length];
      const tipo = tiposHito[i % tiposHito.length];
      const estado = estadosHito[i % estadosHito.length];
      
      const fechaInicio = new Date(evento.fechaInicio);
      fechaInicio.setDate(fechaInicio.getDate() - (30 - i * 2));
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + 7);
      
      const hito = await HitoModel.add({
        nombre: `Hito ${i + 1}: ${tipo} para ${evento.nombre}`,
        descripcion: `Descripción del hito ${i + 1} relacionado con ${tipo}`,
        evento: evento.id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        responsable: responsable.id,
        estado: estado,
        tipo: tipo,
        prioridad: i < 5 ? 'alta' : i < 10 ? 'media' : 'baja',
        orden: i + 1,
        completado: estado === 'completado',
        notas: `Hito ${i + 1} del cronograma`
      });
      
      if (hito) hitos.push(hito);
    }
    console.log(`✅ ${hitos.length} hitos creados`);

    // 11. Crear Tareas
    const tareas = [];
    const tiposTareasProduccion = [
      'Coordinación con proveedores',
      'Montaje de escenario o mobiliario',
      'Verificación técnica previa al evento'
    ];
    const tiposTareasPlanificacion = [
      'Carga y control del presupuesto del evento',
      'Firma de contratos con clientes/proveedores',
      'Seguimiento del cronograma y fechas clave'
    ];
    const tiposTareasAdmin = [
      'Gestión de usuarios del sistema',
      'Control de permisos y accesos'
    ];
    
    for (let i = 0; i < 25; i++) {
      const evento = eventos[i % eventos.length];
      const empleado = empleados[i % empleados.length];
      const area = empleado.area;
      let tipo = '';
      
      if (area === 'Producción y Logística') {
        tipo = tiposTareasProduccion[i % tiposTareasProduccion.length];
      } else if (area === 'Planificación y Finanzas') {
        tipo = tiposTareasPlanificacion[i % tiposTareasPlanificacion.length];
      } else if (area === 'Administración') {
        tipo = tiposTareasAdmin[i % tiposTareasAdmin.length];
      } else {
        tipo = tiposTareasProduccion[0];
      }
      
      const estados = ['pendiente', 'en proceso', 'finalizada'];
      const estado = estados[i % estados.length];
      const prioridades = ['baja', 'media', 'alta'];
      const prioridad = prioridades[i % prioridades.length];
      
      const fechaInicio = new Date(evento.fechaInicio);
      fechaInicio.setDate(fechaInicio.getDate() - (20 - i));
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + 5);
      
      const tarea = await TareaModel.add({
        titulo: `Tarea ${i + 1}: ${tipo}`,
        descripcion: `Descripción de la tarea ${i + 1} relacionada con ${tipo} para ${evento.nombre}`,
        estado: estado,
        prioridad: prioridad,
        area: area,
        tipo: tipo,
        empleadoAsignado: empleado.id,
        eventoAsignado: evento.id,
        horasEstimadas: 4 + (i % 8),
        horasReales: estado === 'finalizada' ? 4 + (i % 8) + (i % 3) : 0,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      });
      
      if (tarea) tareas.push(tarea);
    }
    console.log(`✅ ${tareas.length} tareas creadas`);

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    console.log(`   ✅ Clientes: ${clientes.length}`);
    console.log(`   ✅ Empleados: ${empleados.length} (administradores, planners, coordinadores)`);
    console.log(`   ✅ Usuarios: ${usuarios.length} (vinculados a empleados)`);
    console.log(`   ✅ Eventos: ${eventos.length} (con clientes y responsables asignados)`);
    console.log(`   ✅ Proveedores: ${proveedores.length} (con servicios y tarifas)`);
    console.log(`   ✅ Cotizaciones: ${cotizaciones.length} (con items y estados diversos)`);
    console.log(`   ✅ Gastos: ${gastos.length} (con diferentes estados y métodos de pago)`);
    console.log(`   ✅ Facturas: ${facturas.length} (vinculadas a eventos y cotizaciones)`);
    console.log(`   ✅ Invitados: ${invitados.length} (con invitaciones y estados RSVP)`);
    console.log(`   ✅ Hitos: ${hitos.length} (milestones de eventos)`);
    console.log(`   ✅ Tareas: ${tareas.length} (asignadas a empleados y eventos)`);
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   📧 Email: cualquier email de empleado (ej: alex.lopez@eventify.com)');
    console.log('   🔒 Password: password123');
    console.log('\n💡 Nota: Todos los usuarios tienen la contraseña "password123"');
    console.log('\n📋 Detalles adicionales:');
    console.log('   - Los eventos tienen múltiples responsables asignados');
    console.log('   - Las cotizaciones tienen items con diferentes proveedores');
    console.log('   - Los gastos están vinculados a cotizaciones y eventos');
    console.log('   - Las facturas están vinculadas a eventos y cotizaciones');
    console.log('   - Los invitados tienen invitaciones con enlaces únicos');
    console.log('   - Los hitos están asociados a eventos y responsables');
    console.log('   - Las tareas están asignadas a empleados por área');

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    await disconnectMongo();
    console.log('🔌 Conexión cerrada con MongoDB');
  }
}

// -------------------- EJECUCIÓN --------------------
seedDB()
  .then(() => {
    console.log('\n✅ Seed completado exitosamente');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Error al ejecutar seed:', err);
    process.exit(1);
  });
