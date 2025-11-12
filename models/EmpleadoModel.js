//
// -------------------- MODELO DE EMPLEADO --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const EmpleadoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    rol: {
      type: String,
      enum: ['administrador', 'planner', 'coordinador'],
      required: true,
      lowercase: true,
    },
    area: {
      type: String,
      enum: ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'],
      required: true,
    },
    email: { type: String, lowercase: true, trim: true },
    telefono: { type: String, trim: true },
  },
  { timestamps: true }
);

// -------------------- MODELO --------------------
const Empleado = mongoose.models.Empleado || mongoose.model('Empleado', EmpleadoSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class EmpleadoModel {
  async getAll() {
    try {
      const empleados = await Empleado.find().sort({ createdAt: -1 });
      return empleados.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const empleado = await Empleado.findById(id);
      return toPlain(empleado);
    } catch (error) {
      console.error('Error al obtener empleado por ID:', error);
      return null;
    }
  }

  async add(empleado) {
    try {
      const nuevo = await Empleado.create({
        nombre: empleado.nombre,
        rol: empleado.rol,
        area: empleado.area,
        email: empleado.email || '',
        telefono: empleado.telefono || '',
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      return null;
    }
  }

  async update(id, empleado) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Empleado.findByIdAndUpdate(id, empleado, {
        new: true,
        runValidators: true,
      });
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Empleado.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      );
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente empleado:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Empleado.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      return null;
    }
  }
}

export default new EmpleadoModel();
