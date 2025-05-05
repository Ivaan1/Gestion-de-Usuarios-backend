const mongoose = require('mongoose');
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

const companySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
    },
    address: { // Dirección
        type: addressSchema,
        required: true
    },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
    required: false // Puede ser opcional si la empresa no tiene usuarios asociados
  }
}, { timestamps: true });

module.exports = mongoose.model('companies', companySchema); 