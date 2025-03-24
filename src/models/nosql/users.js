const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const UserScheme = new mongoose.Schema(
    {
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // Validador de email válido
    },
    password: {
        type: String,
        required: true,
        minlength: 8 // Mínimo 8 caracteres
    },
    role: {
        type: String,
        default: 'user', // Rol por defecto, pero puede cambiar a 'guest', 'admin', etc.
        enum: ['user', 'guest', 'admin']
    },
    status: {
        type: String,
        default: 'pending', // Puede cambiar a 'verified' después de validar el email
        enum: ['pending', 'verified']
    },
    verificationCode: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6 // Código de verificación de 6 dígitos
    },
    verificationAttempts: {
        type: Number,
        default: 0 // Número de intentos de validación
    },
    personalInfo: {
        firstName: String,
        lastName: String,
        nif: String // Puedes validar el formato NIF si es necesario
    },
    companyInfo: {
        companyName: String,
        cif: String,
        address: String
    },
    logoUrl: String, // URL del logo en disco o en la nube
    createdAt: {
        type: Date,
        default: Date.now
    }
}, 
{
    timestamp: true, // TODO createdAt, updatedAt
    versionKey: false
}
);

UserScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("users", UserScheme) // Nombre de la colección (o de la tabla en SQL)