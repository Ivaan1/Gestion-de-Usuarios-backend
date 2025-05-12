const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorCreateClient = [
    check("name").exists().notEmpty().withMessage("El nombre es obligatorio"),
    check("email").exists().notEmpty().isEmail().withMessage("El correo es obligatorio"),
    check("address").exists().notEmpty().withMessage("La dirección es obligatoria"),
    check("address.street").exists().notEmpty().withMessage("La calle es obligatoria"),
    check("address.number").exists().isNumeric().withMessage("El número debe ser numérico"),
    check("address.postal").exists().isNumeric().withMessage("El código postal debe ser numérico"),
    check("address.city").exists().notEmpty().withMessage("La ciudad es obligatoria"),
    check("address.province").exists().notEmpty().withMessage("La provincia es obligatoria"),
    (req, res, next) => {
        validateResults(req, res, next)
    }
]

// validator para manejar a un cliente por ID
const validatorGetClient = [
    check("id").exists().notEmpty().isMongoId().withMessage("El id es obligatorio"),
    (req, res, next) => {
        validateResults(req, res, next)
    }
]

// Validator para actualizar un cliente
const validatorUpdateClient = [
  check("name").optional().isString().notEmpty(),
  check("email").optional().isEmail(),
  check("cif").optional().isString().notEmpty(),
  check("address.street").optional().isString(),
  check("address.number").optional().isNumeric(),
  check("address.postal").optional().isNumeric(),
  check("address.city").optional().isString(),
  check("address.province").optional().isString(),
  check("activeProjects").optional().isNumeric(),
  check("pendingDeliveryNotes").optional().isNumeric(),
];

module.exports = { 
    validatorCreateClient,
    validatorGetClient,
    validatorUpdateClient
}