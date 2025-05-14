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
        required: false, // lo manejamos en el controlador
        ref: 'users' // Referencia al modelo de usuario
    },
    companyId: { // ID de la empresa asociada
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Puede ser opcional si el usuario no está asociado a una empresa
        ref: 'companies'
    },
    name: { // Nombre del cliente
        type: String,
        required: true
    },
    cif: { // CIF del cliente
        type: String,
        required: true,
        unique: true // El CIF debe ser único 
    },
    email: {
        type: String,
        required: true
    },
    activeProjects: { // Proyectos activos
        type: Number,
        default: 0
    },
    pendingDeliveryNotes: { // Albaranes pendientes
        type: Number,
        default: 0
    },
    deleted: { // Usuario eliminado
        type: Boolean,
        default: false
    }
}, { timestamps: true }) // Usar timestamps para createdAt y updatedAt


module.exports = mongoose.model('client', clientSchema)
