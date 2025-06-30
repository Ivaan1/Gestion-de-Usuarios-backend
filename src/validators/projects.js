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
  check("description").notEmpty().withMessage("La descripción es obligatoria"),
  
  (req, res, next) => validateResults(req, res, next),
];

const validatorUpdateProject = [

  check("name").optional().isString().withMessage("El nombre debe ser una cadena de texto"),

  check("code").optional().isString().withMessage("El código interno debe ser una cadena de texto"),
  check("clientId").optional().isMongoId().withMessage("El ID del cliente debe ser válido"),

  check("description").optional().isString().withMessage("La descripción debe ser una cadena de texto"),
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
