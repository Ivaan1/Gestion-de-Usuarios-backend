const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateUser = [
    check("email").isEmail().exists().notEmpty().withMessage("El correo electrónico es obligatorio"),
    check("password").isLength({min: 8}).withMessage("La contraseña debe ser al menos de 8 caracteres"),
    check("password").exists().notEmpty().withMessage("La contraseña es obligatoria"),
    check("role").optional(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorGetUser = [
    check("id").exists().notEmpty().isMongoId(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorUpdateUser = [
    check("name").optional(),
    check("role").optional(),
    check("profilePicture").optional(),
    check("about").optional(),
    check("phone").optional(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorAddCompany = [
    check("name").exists().notEmpty().withMessage("El nombre de la compañia es obligatorio"),
    check("address").exists().notEmpty().withMessage("La dirección de la compañia es obligatoria"),
    check("address.street").exists().notEmpty().withMessage("La calle de la compañia es obligatoria"),
    check("address.number").exists().notEmpty().withMessage("El número de la compañia es obligatorio"),
    check("address.postal").exists().notEmpty().withMessage("El código postal de la compañia es obligatorio"),
    check("address.city").exists().notEmpty().withMessage("La ciudad de la compañia es obligatoria"),
    check("address.province").exists().notEmpty().withMessage("La provincia de la compañia es obligatoria"),
    (req, res, next) => validateResults(req, res, next)
];


module.exports = {
    validatorGetUser, 
    validatorCreateUser, 
    validatorUpdateUser,
    validatorAddCompany,
}