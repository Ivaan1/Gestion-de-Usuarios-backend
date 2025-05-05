const mongoose = require('mongoose');

// Dirección del proyecto
const addressSchema = new mongoose.Schema({
    street: { // Calle
        type: String,
        required: true
    },
    number: { // Número de la dirección
        type: Number,
        required: true
    },
    postal: { // Código postal
        type: Number,
        required: true
    },
    city: { // Ciudad
        type: String,
        required: true
    },
    province: { // Provincia
        type: String,
        required: true
    }
}, { _id: false }); // No queremos un _id para la dirección

// Modelo de Proyecto
const projectSchema = new mongoose.Schema({
    name: { // Nombre del proyecto
        type: String,
        required: true
    },
    projectCode: { // Código de identificación del proyecto
        type: String,
        required: true
    },
    address: { // Dirección del proyecto
        type: addressSchema,
        required: false
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
