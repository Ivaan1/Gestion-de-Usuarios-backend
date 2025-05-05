const mongoose = require("mongoose")


// Direccion del usuario
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


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // required: true
        },
        profilePicture: { //URL de PINATA
            type: String,
            // required: true
        },
        email: {
            type: String, 
            unique: true,
            required: true
        },
        password: {
            type: String, 
            select: false
        },
        role: {
            type: String,
            enum: ["usuario", "admin"], 
            default: "usuario"
        },
        registryDate: {
            type: Date,
            default: Date.now,
            select: false
        },
        step: Number,
        tries: {
            type: Number,
            default: 3
        },
        validationCode: {
            type: Number
        }, 
        validated: {
            type: Boolean,
            default: false
        },
        nif: {
            type: String,
            required: false
        },
        address: { // Dirección del usuario
            type: addressSchema,
            required: false
        },
        deleted: { // Usuario eliminado
            type: Boolean,
            default: false
        },
        companyId: { // ID de la empresa asociada
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'companies' 
        },
    },
    {
        timestamp: true, 
        versionKey: false
    }
)
module.exports = mongoose.model("users", userSchema) // “users” es el nombre de la colección en mongoDB (o de la tabla en SQL)