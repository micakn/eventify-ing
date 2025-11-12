// utils/pdfGenerator.js
// -------------------- GENERADOR DE PDFs PARA COTIZACIONES --------------------
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera un PDF de cotización
 * @param {Object} cotizacion - Objeto de cotización con todos los datos
 * @param {String} outputPath - Ruta donde guardar el PDF (opcional)
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
export async function generarPDFCotizacion(cotizacion, outputPath = null) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      // Acumular chunks del PDF
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        if (outputPath) {
          fs.writeFileSync(outputPath, pdfBuffer);
        }
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // -------------------- ENCABEZADO --------------------
      doc.fontSize(20).text('EVENTIFY', { align: 'center' });
      doc.fontSize(12).text('Sistema de Gestión de Eventos', { align: 'center' });
      doc.moveDown();

      // -------------------- INFORMACIÓN DE COTIZACIÓN --------------------
      doc.fontSize(16).text('COTIZACIÓN', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12);
      doc.text(`Número: ${cotizacion.numero}`, { align: 'left' });
      doc.text(`Versión: ${cotizacion.version}`, { align: 'left' });
      doc.text(`Fecha: ${new Date(cotizacion.createdAt).toLocaleDateString('es-AR')}`, { align: 'left' });
      doc.text(`Estado: ${cotizacion.estado.toUpperCase()}`, { align: 'left' });
      doc.moveDown();

      // -------------------- INFORMACIÓN DEL CLIENTE --------------------
      if (cotizacion.cliente) {
        doc.fontSize(14).text('CLIENTE', { underline: true });
        doc.fontSize(12);
        doc.text(`Nombre: ${cotizacion.cliente.nombre || 'N/A'}`);
        if (cotizacion.cliente.empresa) {
          doc.text(`Empresa: ${cotizacion.cliente.empresa}`);
        }
        if (cotizacion.cliente.email) {
          doc.text(`Email: ${cotizacion.cliente.email}`);
        }
        doc.moveDown();
      }

      // -------------------- INFORMACIÓN DEL EVENTO --------------------
      if (cotizacion.evento) {
        doc.fontSize(14).text('EVENTO', { underline: true });
        doc.fontSize(12);
        doc.text(`Nombre: ${cotizacion.evento.nombre || 'N/A'}`);
        if (cotizacion.evento.lugar) {
          doc.text(`Lugar: ${cotizacion.evento.lugar}`);
        }
        if (cotizacion.evento.fechaInicio) {
          doc.text(`Fecha: ${new Date(cotizacion.evento.fechaInicio).toLocaleDateString('es-AR')}`);
        }
        doc.moveDown();
      }

      // -------------------- ITEMS DE LA COTIZACIÓN --------------------
      if (cotizacion.items && cotizacion.items.length > 0) {
        doc.fontSize(14).text('DETALLE DE SERVICIOS', { underline: true });
        doc.moveDown();

        // Encabezado de tabla
        const tableTop = doc.y;
        doc.fontSize(10);
        doc.text('Descripción', 50, tableTop);
        doc.text('Cant.', 300, tableTop);
        doc.text('Precio Unit.', 350, tableTop);
        doc.text('Subtotal', 450, tableTop);
        
        doc.moveTo(50, doc.y + 5)
          .lineTo(550, doc.y + 5)
          .stroke();
        
        doc.moveDown(0.5);

        // Items
        cotizacion.items.forEach((item, index) => {
          const y = doc.y;
          
          // Descripción (con salto de línea si es muy larga)
          doc.text(item.descripcion || 'N/A', 50, y, { width: 240 });
          
          // Cantidad y unidad
          doc.text(`${item.cantidad || 0} ${item.unidad || 'unidad'}`, 300, y);
          
          // Precio unitario
          doc.text(`$${item.precioUnitario?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}`, 350, y);
          
          // Subtotal
          doc.text(`$${item.subtotal?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}`, 450, y);
          
          // Proveedor (si está disponible)
          if (item.proveedor && item.proveedor.nombre) {
            doc.fontSize(8).fillColor('gray');
            doc.text(`Proveedor: ${item.proveedor.nombre}`, 50, doc.y + 2);
            doc.fontSize(10).fillColor('black');
          }
          
          doc.moveDown(0.8);
          
          // Línea separadora
          if (index < cotizacion.items.length - 1) {
            doc.moveTo(50, doc.y)
              .lineTo(550, doc.y)
              .stroke();
            doc.moveDown(0.3);
          }
        });

        doc.moveDown();
      }

      // -------------------- TOTALES --------------------
      doc.moveDown();
      doc.moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
      doc.moveDown();

      doc.fontSize(12);
      doc.text('Subtotal:', 350, doc.y);
      doc.text(`$${cotizacion.subtotal?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}`, 450, doc.y, { align: 'right' });
      doc.moveDown();

      doc.text(`Margen (${cotizacion.margenPorcentaje || 0}%):`, 350, doc.y);
      doc.text(`$${cotizacion.margenMonto?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}`, 450, doc.y, { align: 'right' });
      doc.moveDown();

      doc.text('IVA (21%):', 350, doc.y);
      doc.text(`$${cotizacion.iva?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}`, 450, doc.y, { align: 'right' });
      doc.moveDown();

      doc.fontSize(14).font('Helvetica-Bold');
      doc.text('TOTAL:', 350, doc.y);
      doc.text(`$${cotizacion.total?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}`, 450, doc.y, { align: 'right' });
      doc.moveDown(2);

      // -------------------- OBSERVACIONES --------------------
      if (cotizacion.observaciones) {
        doc.fontSize(12).font('Helvetica');
        doc.text('OBSERVACIONES:', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(10);
        doc.text(cotizacion.observaciones, { width: 500 });
        doc.moveDown();
      }

      // -------------------- PIE DE PÁGINA --------------------
      doc.fontSize(8).fillColor('gray');
      doc.text(
        `Generado el ${new Date().toLocaleString('es-AR')} - Eventify Sistema de Gestión`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

      // Finalizar documento
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

