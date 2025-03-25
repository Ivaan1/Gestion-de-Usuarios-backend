const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

 const validatorRegister = [
     check("email").exists().notEmpty().isEmail().withMessage("El correo es super obligatorio."),
     check("password").exists().notEmpty().isLength({ min: 8, max: 16 }).withMessage("La contraseña es obligatoria."),
     (req, res, next) => {
         return validateResults(req, res, next)
    }
 ]


const validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").isLength({ min: 8, max: 16 }).withMessage("La contraseña tiene que tener entre 8 y 16 caracteres"),
    check("password").exists().notEmpty().withMessage("La contraseña es obligatoria"),
    (req, res, next) => validateResults(req, res, next)
]

const validatorValidation = [
    check("code").exists().notEmpty().isNumeric(),
    (req, res, next) => validateResults(req, res, next)
]

const validatorRecoverPassword = [
    check("email").exists().notEmpty().isEmail().withMessage("Email required"),
    check("email").isEmail().withMessage("Has to be valid email"),
    (req, res, next) => validateResults(req, res, next)
]

const validatorNewPassword = [
    check("code").optional(),
    check("oldPassword").optional(),
    check("newPassword1").exists().notEmpty().withMessage("La contraseña es obligatoria"),
    check("newPassword1").isLength({ min: 8, max: 16 }).withMessage("La contraseña tiene que tener entre 8 y 16 caracteres"),
    check("newPassword2").exists().notEmpty().withMessage("La contraseña es obligatoria"),
    check("newPassword2").isLength({ min: 8, max: 16 }).withMessage("La contraseña tiene que tener entre 8 y 16 caracteres"),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorRegister, validatorLogin , validatorNewPassword, validatorValidation, validatorRecoverPassword}