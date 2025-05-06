const { usersModel } = require('../models')
const { handleHttpError } = require('../utils/handleErrors')


async function validateUserMiddleware (req, res, next) {

    const { id } = req.user; // ID sacado del token   
    const user = await usersModel.findById(id);

    if (!user.validated) {
        return handleHttpError(res, 'USER_NOT_VALIDATED', 404);
    }

    next(); // Si el usuario está validado, continuar con la siguiente ruta
}

module.exports = {
    validateUserMiddleware
};