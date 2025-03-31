const mongoose = require("mongoose")
const UserScheme = new mongoose.Schema(
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
            type: String, // TODO Guardaremos el hash
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
        validationCode: {
            type: Number
        }, 
        validated: {
            type: Boolean,
            default: false
        },
        about: {
            type: String
        },
        phone: {
            type: String
        }
    },
    {
        timestamp: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
module.exports = mongoose.model("users", UserScheme) // “users” es el nombre de la colección en mongoDB (o de la tabla en SQL)