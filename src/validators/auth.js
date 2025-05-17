const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

 const validatorRegister = [
    check("email")
    .exists().withMessage("El correo es obligatorio.")
    .notEmpty().withMessage("El correo no puede estar vacío.")
    .isEmail().withMessage("El correo no tiene un formato válido."),
    check("password")
    .exists().withMessage("La contraseña es obligatoria.")
    .notEmpty().withMessage("La contraseña no puede estar vacía.")
    .isLength({ min: 8, max: 16 }).withMessage("La contraseña debe tener entre 8 y 16 caracteres."),
  
     (req, res, next) => {
         return validateResults(req, res, next)
    }
 ]


const validatorLogin = [
    check("email")
    .exists().withMessage("El correo es obligatorio.")
    .notEmpty().withMessage("El correo no puede estar vacío.")
    .isEmail().withMessage("El correo no tiene un formato válido."),

  check("password")
    .exists().withMessage("La contraseña es obligatoria.")
    .notEmpty().withMessage("La contraseña no puede estar vacía.")
    .isLength({ min: 8, max: 16 }).withMessage("La contraseña tiene que tener entre 8 y 16 caracteres"),

    (req, res, next) => validateResults(req, res, next)
]

const validatorValidation = [
    check("code")
    .exists().withMessage("El código es obligatorio.")
    .notEmpty().withMessage("El código no puede estar vacío.")
    .isNumeric().withMessage("El código debe ser numérico."),
  
    (req, res, next) => validateResults(req, res, next)
]

const validatorRecoverPassword = [
    check("email")
    .exists().withMessage("El email es obligatorio.")
    .notEmpty().withMessage("El email no puede estar vacío.")
    .isEmail().withMessage("Debe ser un email válido."),
    (req, res, next) => validateResults(req, res, next)
]

const validatorNewPassword = [
    check("code").optional(),
  check("oldPassword").optional(),

  check("newPassword1")
    .exists().withMessage("La contraseña es obligatoria.")
    .notEmpty().withMessage("La contraseña no puede estar vacía.")
    .isLength({ min: 8, max: 16 }).withMessage("Debe tener entre 8 y 16 caracteres."),

  check("newPassword2")
    .exists().withMessage("La contraseña es obligatoria.")
    .notEmpty().withMessage("La contraseña no puede estar vacía.")
    .isLength({ min: 8, max: 16 }).withMessage("Debe tener entre 8 y 16 caracteres."),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorRegister, validatorLogin , validatorNewPassword, validatorValidation, validatorRecoverPassword}