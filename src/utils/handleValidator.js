// Se importa 'validationResult' desde el paquete 'express-validator', 
// que es una herramienta útil para validar y sanear los datos de las solicitudes HTTP en Express.
const { validationResult } = require("express-validator");

// Se define una función llamada 'validateResults', que será un middleware de Express.
const validateResults = (req, res, next) => {
    try {
        // Obtenemos los resultados de la validación
        const result = validationResult(req);

        // Imprimir el resultado de la validación para depuración
        console.log("Validation Result: ", result);

        // Verificamos si hay errores de validación
        if (!result.isEmpty()) {
            // Si hay errores, lanzamos un error y los enviamos al cliente
            res.status(400).send({
                errors: result.array() // Enviamos los errores como un array
            });
        } else {
            // Si no hay errores, continuamos con el siguiente middleware
            return next();
        }
    } catch (err) {
        // Si ocurre un error (es decir, si la validación falla), se captura en 'catch'
        // y se responde al cliente con un código de estado 403 (Forbidden).
        res.status(403);

        // Se envía una respuesta con los errores de validación.
        // 'err.array()' obtiene los errores como un array de objetos,
        // que típicamente incluyen información sobre el tipo de error, el mensaje, etc.
        res.send({ errors: err.array() });
    }
};

// Se exporta el middleware para poder utilizarlo en otras partes de la aplicación.
module.exports = validateResults;
