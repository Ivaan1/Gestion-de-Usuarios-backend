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
    },
    {
        timestamp: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
module.exports = mongoose.model("users", UserScheme) // “users” es el nombre de la colección en mongoDB (o de la tabla en SQL)