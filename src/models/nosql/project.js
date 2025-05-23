const mongoose = require('mongoose');


// Modelo de Proyecto
const projectSchema = new mongoose.Schema({
    name: { // Nombre del proyecto
        type: String,
        required: true
    },
    projectCode: { // Código de identificación del proyecto
        type: String,
        required: true,
        unique: true // Debe ser único
    },
    description: { // Descripción del proyecto
        type: String,
        required: true
    },
    code: { // Código interno del proyecto
        type: String,
        required: false
    },
    clientId: { // ID del cliente relacionado con este proyecto
        type: mongoose.Schema.Types.ObjectId,
        ref: "client", // Asegúrate de que coincida con el modelo de cliente
        required: true
    },
    notes: { // Notas del proyecto
        type: String,
        required: false
    },
    userId: { // ID del usuario que creó el proyecto
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Asegúrate de que coincida con el modelo de usuario
        required: true
    },
    deleted: { // Proyecto eliminado
        type: Boolean,
        default: false
    },
    begin: {
      type: Date, // Usamos Date para almacenar fechas
      required: false,
    },
    end: {
      type: Date, // Usamos Date para almacenar fechas
      required: false,
    },
}, { timestamps: true, versionKey: false }); // Usamos timestamps para createdAt y updatedAt

module.exports = mongoose.model('project', projectSchema);
