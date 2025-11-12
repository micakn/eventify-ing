// middleware/upload.js
// -------------------- CONFIGURACIÓN DE MULTER PARA UPLOAD DE ARCHIVOS --------------------
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- CONFIGURACIÓN DE ALMACENAMIENTO --------------------
const storage = multer.memoryStorage(); // Almacenar en memoria (buffer)

// -------------------- FILTRO DE ARCHIVOS --------------------
const fileFilter = (req, file, cb) => {
  // Aceptar solo archivos Excel y CSV
  const allowedMimes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/csv'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten archivos Excel (.xls, .xlsx) y CSV'));
  }
};

// -------------------- CONFIGURACIÓN DE MULTER --------------------
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

export default upload;

