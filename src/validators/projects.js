const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorGetProject = [
  check("id").exists().notEmpty().isMongoId().withMessage("El id es obligatorio"),
  (req, res, next) => validateResults(req, res, next),
];  


const validatorCreateProject = [
  check("name").notEmpty().withMessage("El nombre es obligatorio"),
  check("projectCode").notEmpty().withMessage("El identificador del proyecto es obligatorio"),
  check("code").notEmpty().withMessage("El código interno es obligatorio"),
  check("clientId").isMongoId().withMessage("El ID del cliente debe ser válido"),

  (req, res, next) => validateResults(req, res, next),
];

const validatorUpdateProject = [

  check("name").optional().isString().withMessage("El nombre debe ser una cadena de texto"),

  check("address.street").optional().isString().withMessage("La calle debe ser una cadena de texto"),
  check("address.number").optional().isNumeric().withMessage("El número debe ser un número"),
  check("address.postal").optional().isNumeric().withMessage("El código postal debe ser un número"),
  check("address.city").optional().isString().withMessage("La ciudad debe ser una cadena de texto"),
  check("address.province").optional().isString().withMessage("La provincia debe ser una cadena de texto"),

  check("code").optional().isString().withMessage("El código interno debe ser una cadena de texto"),
  check("clientId").optional().isMongoId().withMessage("El ID del cliente debe ser válido"),

  
  check("notes").optional().isString().withMessage("Las notas deben ser una cadena de texto"),
  check("begin").optional().isDate().withMessage("La fecha de inicio debe ser una fecha válida"),
  check("end").optional().isDate().withMessage("La fecha de fin debe ser una fecha válida"),

  (req, res, next) => validateResults(req, res, next),
];

module.exports = {
    validatorCreateProject,
    validatorUpdateProject,
    validatorGetProject
    };
