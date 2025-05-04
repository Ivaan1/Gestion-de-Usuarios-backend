const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorCreateClient = [
    check("name").exists().notEmpty().withMessage("El nombre es obligatorio"),
    check("email").exists().notEmpty().isEmail().withMessage("El correo es obligatorio"),
    check("cif").exists().notEmpty().withMessage("El CIF es obligatorio"),
    check("userId").exists().notEmpty().isMongoId().withMessage("El ID de usuario es obligatorio y debe ser un ID válido"),
    check("address").exists().notEmpty().withMessage("La dirección es obligatoria"),
    check("address.street").exists().notEmpty().withMessage("La calle es obligatoria"),
    check("address.number").exists().isNumeric().withMessage("El número debe ser numérico"),
    check("address.postal").exists().isNumeric().withMessage("El código postal debe ser numérico"),
    check("address.city").exists().notEmpty().withMessage("La ciudad es obligatoria"),
    check("address.province").exists().notEmpty().withMessage("La provincia es obligatoria"),
    check("deleted").optional().isBoolean().withMessage("El campo 'deleted' debe ser un booleano"),
    (req, res, next) => {
        validateResults(req, res, next)
    }
]

//validator para obtener un cliente por ID
const validatorGetClient = [
    check("id").exists().notEmpty().isMongoId().withMessage("El id es obligatorio"),
    (req, res, next) => {
        validateResults(req, res, next)
    }
]

module.exports = { 
    validatorCreateClient,
    validatorGetClient
}