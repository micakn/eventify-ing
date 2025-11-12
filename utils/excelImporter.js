// utils/excelImporter.js
// -------------------- IMPORTADOR DE ARCHIVOS EXCEL/CSV --------------------
import XLSX from 'xlsx';

/**
 * Lee un archivo Excel/CSV y retorna los datos como array de objetos
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {String} filename - Nombre del archivo (para detectar extensión)
 * @returns {Array} - Array de objetos con los datos
 */
export function leerExcel(fileBuffer, filename) {
  try {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data;
  } catch (error) {
    console.error('Error al leer archivo Excel:', error);
    throw new Error('Error al procesar el archivo Excel');
  }
}

/**
 * Mapea los datos del Excel a formato de invitado
 * @param {Array} datos - Datos del Excel
 * @param {Object} mapeo - Mapeo de columnas (ej: { nombre: 'Nombre', email: 'Email' })
 * @returns {Array} - Array de objetos Invitado
 */
export function mapearDatosInvitados(datos, mapeo = {}) {
  // Buscar las columnas reales en los datos
  const columnas = datos.length > 0 ? Object.keys(datos[0]) : [];
  
  // Valores posibles para cada campo
  const posiblesValores = {
    nombre: ['nombre', 'Nombre', 'NOMBRE', 'name', 'Name', 'NAME', 'nombres', 'Nombres'],
    apellido: ['apellido', 'Apellido', 'APELLIDO', 'lastname', 'Lastname', 'surname', 'Surname', 'apellidos', 'Apellidos'],
    email: ['email', 'Email', 'EMAIL', 'e-mail', 'E-mail', 'correo', 'Correo', 'CORREO', 'mail', 'Mail'],
    telefono: ['telefono', 'Teléfono', 'TELEFONO', 'phone', 'Phone', 'tel', 'Tel', 'telefono', 'Teléfono'],
    categoria: ['categoria', 'Categoría', 'CATEGORIA', 'category', 'Category', 'tipo', 'Tipo'],
    mesa: ['mesa', 'Mesa', 'MESA', 'table', 'Table', 'mesaasignada', 'MesaAsignada'],
    acompanantes: ['acompanantes', 'Acompañantes', 'ACOMPANANTES', 'guests', 'Guests', 'guest', 'Guest', 'invitados', 'Invitados']
  };

  // Función para buscar columna
  const buscarColumna = (campo) => {
    // Si se proporciona mapeo explícito, usarlo
    if (mapeo[campo] && columnas.includes(mapeo[campo])) {
      return mapeo[campo];
    }
    
    // Buscar en las columnas disponibles
    const valores = posiblesValores[campo] || [];
    for (const valor of valores) {
      const columna = columnas.find(col => 
        col.toLowerCase().trim() === valor.toLowerCase().trim()
      );
      if (columna) {
        return columna;
      }
    }
    
    return null;
  };

  const mapeoFinal = {
    nombre: buscarColumna('nombre'),
    apellido: buscarColumna('apellido'),
    email: buscarColumna('email'),
    telefono: buscarColumna('telefono'),
    categoria: buscarColumna('categoria'),
    mesa: buscarColumna('mesa'),
    acompanantes: buscarColumna('acompanantes')
  };

  // Mapear los datos
  const invitados = datos.map((fila, index) => {
    const invitado = {
      nombre: fila[mapeoFinal.nombre] || fila[columnas[0]] || `Invitado ${index + 1}`,
      apellido: fila[mapeoFinal.apellido] || '',
      email: fila[mapeoFinal.email] || '',
      telefono: fila[mapeoFinal.telefono] || '',
      categoria: fila[mapeoFinal.categoria] || 'Estándar',
      mesa: fila[mapeoFinal.mesa] || '',
      acompanantes: parseInt(fila[mapeoFinal.acompanantes]) || 0
    };

    // Validar email (requerido)
    if (!invitado.email || !/^\S+@\S+\.\S+$/.test(invitado.email)) {
      throw new Error(`Fila ${index + 1}: Email inválido o faltante`);
    }

    return invitado;
  });

  return invitados;
}

/**
 * Valida los datos de invitados antes de importar
 * @param {Array} invitados - Array de invitados a validar
 * @returns {Object} - { validos: [], invalidos: [], errores: [] }
 */
export function validarInvitados(invitados) {
  const validos = [];
  const invalidos = [];
  const errores = [];

  invitados.forEach((invitado, index) => {
    const erroresInvitado = [];

    if (!invitado.nombre || invitado.nombre.trim().length < 2) {
      erroresInvitado.push('Nombre inválido o muy corto');
    }

    if (!invitado.email || !/^\S+@\S+\.\S+$/.test(invitado.email)) {
      erroresInvitado.push('Email inválido o faltante');
    }

    if (erroresInvitado.length > 0) {
      invalidos.push(invitado);
      errores.push({
        fila: index + 1,
        email: invitado.email || 'N/A',
        errores: erroresInvitado
      });
    } else {
      validos.push(invitado);
    }
  });

  return { validos, invalidos, errores };
}

