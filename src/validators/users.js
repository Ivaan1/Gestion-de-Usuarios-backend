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
    (req, res, next) => validateResults(req, res, next)
];


//TODO: preguntar a Profesor
const validatorUpdateUserPhoto = [
    (req, res, next) => validateResults(req, res, next)
]

module.exports = {validatorGetUser, validatorCreateUser, validatorUpdateUser}