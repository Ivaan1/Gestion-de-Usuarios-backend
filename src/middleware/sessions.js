const {usersModel} = require('../models')
const { handleHttpError } = require('../utils/handleErrors')
const { verifyToken } = require('../utils/handleJWT')

async function authMiddleWare(req, res, next) {
    try {
        if (!req.headers.authorization) {
            handleHttpError(res, 'NO_TOKEN_FOUND', 401)
            return
        }

        const token = req.headers.authorization.split(' ').pop()

        const dataToken = await verifyToken(token)

        if (!dataToken._id) {
            handleHttpError(res, 'ERROR_WITH_TOKEN', 401)
            return
        }

        const user = await usersModel.findById(dataToken._id)
        console.log('Middleware auth ejecutado');
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        handleHttpError(res, 'NOT_SESSION', 401)
    }
}

module.exports = authMiddleWare