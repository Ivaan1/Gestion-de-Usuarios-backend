const mongoose = require('mongoose')

// Dirección del cliente
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
}, { _id: false }) // No queremos un _id para la dirección

// Modelo de Cliente
const clientSchema = new mongoose.Schema({
    address: { // Dirección
        type: addressSchema,
        required: false
    },
    userId: { // ID del usuario asociado
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user' // Referencia al modelo de usuario
    },
    name: { // Nombre del cliente
        type: String,
        required: true
    },
    cif: { // CIF del cliente
        type: String,
        required: false
    },
    logo: { // Logo del cliente
        type: String,
        required: false
    },
    activeProjects: { // Proyectos activos
        type: Number,
        default: 0
    },
    pendingDeliveryNotes: { // Albaranes pendientes
        type: Number,
        default: 0
    }
}, { timestamps: true }) // Usar timestamps para createdAt y updatedAt

const Client = mongoose.model('client', clientSchema)

module.exports = Client
