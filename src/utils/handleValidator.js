// Se importa 'validationResult' desde el paquete 'express-validator', 
// que es una herramienta útil para validar y sanear los datos de las solicitudes HTTP en Express.
const { validationResult } = require("express-validator");

// Se define una función llamada 'validateResults', que será un middleware de Express.
const validateResults = (req, res, next) => {
    try {
        // 'validationResult(req)' obtiene los resultados de la validación de los datos
        // que se han validado previamente en la ruta usando 'express-validator'.
        // 'throw()' lanza un error si se encuentra algún problema con los datos validados.
        validationResult(req).throw();
        
        // Si la validación es exitosa (no lanza error), se pasa al siguiente middleware
        // o a la siguiente función en la cadena con 'next()'.
        return next();
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
