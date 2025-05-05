const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateAlbaran = [
    check('clientId')
        .exists().withMessage('El clientId debe ser un ID de MongoDB válido')
        .notEmpty().withMessage('El clientId es obligatorio'),
    
    check('projectId')
        .exists().withMessage('El projectId debe ser un ID de MongoDB válido')
        .notEmpty().withMessage('El projectId es obligatorio'),

    check('format')
        .exists().withMessage("El formato es obligatorio")
        .isIn(["material", "hours"]).withMessage("El formato debe ser 'material' o 'hours'"),

    check('material')
        .optional({ checkFalsy: true })
        .isString().withMessage("El material debe ser una cadena de texto"),

    check('hours')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage("Las horas deben ser un número"),

    check('description')
        .exists().withMessage("La descripción es obligatoria")
        .isString().withMessage("La descripción debe ser una cadena de texto"),

    check('workdate')
        .optional({ checkFalsy: true })
        .isDate().withMessage('La fecha de trabajo debe ser una fecha válida'),

    check('sign')
        .optional({ checkFalsy: true })
        .isString().withMessage('La firma debe ser una cadena de texto'),

    check('pending')
        .optional({ checkFalsy: true })
        .isBoolean().withMessage('El estado pendiente debe ser un valor booleano'),

    // Validar los resultados con la función personalizada
    (req, res, next) => {
        validateResults(req, res, next);  // Asegúrate de que validateResults esté bien configurado
    }
];

module.exports = {
    validatorCreateAlbaran
};
