//
// -------------------- MODELO DE CLIENTE --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
// Define la estructura de los documentos en la colección "clientes".
const ClienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    telefono: { type: String, trim: true },
    empresa: { type: String, trim: true },
    notas: { type: String, trim: true },
  },
  { timestamps: true }
);

// -------------------- MODELO --------------------
const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  return obj;
}

// -------------------- CRUD --------------------
class ClienteModel {
  async getAll() {
    try {
      const clientes = await Cliente.find().sort({ createdAt: -1 });
      return clientes.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const cliente = await Cliente.findById(id);
      return toPlain(cliente);
    } catch (error) {
      console.error('Error al obtener cliente por ID:', error);
      return null;
    }
  }

  async add(cliente) {
    try {
      const nuevo = await Cliente.create({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono || '',
        empresa: cliente.empresa || '',
        notas: cliente.notas || '',
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      return null;
    }
  }

  async update(id, cliente) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Cliente.findByIdAndUpdate(id, cliente, {
        new: true,
        runValidators: true,
      });
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Cliente.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      );
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente cliente:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Cliente.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      return null;
    }
  }
}

export default new ClienteModel();
