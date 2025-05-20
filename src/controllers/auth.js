const { matchedData } = require('express-validator')
const { encrypt, compare } = require('../utils/handlePassword')
const { tokenSign, tokenSignRecovery } = require('../utils/handleJWT')
const { usersModel } = require('../models')
const { handleHttpError } = require('../utils/handleErrors')
const { sendEmail } = require("../utils/handleEmail")
const { loggerStream } = require('../utils/handleLogger')

async function registerUser(req, res) {
    try {
        req = matchedData(req)

        const validationCode = Math.floor(100000 + Math.random() * 900000);


        const password = await encrypt(req.password)

        const body = { ...req, password, validationCode }

        //Se crea el usuario en la base de datos
        const dataUser = await usersModel.create(body)

        sendEmail({
            subject: 'Tu código de verificación',
            text: validationCode.toString(),
            from: process.env.EMAIL,
            to: req.email
        })

        const data = {
            token: tokenSign(dataUser),
            user: dataUser
        }

        res.send(data)
        

    } catch (e) {
            console.log(e)
            handleHttpError(res, 'REGISTER_ERROR')
             // Añade el mensaje de error real en Slack
            loggerStream.write(`🚨 Ha ocurrido un error crítico: ${e.message}`);
    }
}


async function validateUser(req, res) {
    try {
        //El id lo cojo del token
        const id = req.user.id
        const { code } = matchedData(req)
        const user = await usersModel.findById(id).select("validationCode tries")

        if (!user) {
            handleHttpError(res, 'USER_NOT_FOUND')
            return
        }
        else if (user.tries === 0) {
            handleHttpError(res, 'NO_MORE_TRIES', 400)
            return
        } else if (user.validated) {
            console.log("Already validated")
            return
        }
        
        if (code === user.validationCode) {
            const validated = true
            const response = await usersModel.findByIdAndUpdate(id, { $set: { validated } }, { new: true })
            console.log("Usuario validado")
            const token = tokenSign(response) 
            res.send({ user: response, token })
            
        } else {
            const tries = Number(user.tries) - 1
            const response = await usersModel.findByIdAndUpdate(id, { $set: { tries } }, { new: true })
            console.log("Código inválido")
            res.send(response)
        }

    } catch (e) {
        console.log(e)
        handleHttpError(res, 'VALIDATION_ERROR')
        loggerStream.write(`🚨 Ha ocurrido un error crítico: ${e.message}`);
    }
}



async function loginUser(req, res) {
    try {
        const { email, password } = matchedData(req)

        const user = await usersModel.findOne({ email: email }).select("name role email validated password")

        if (!user) {
            return handleHttpError(res, 'USER_NOT_EXISTS', 404)
        }
        
        if(!user.validated){
            return handleHttpError(res, 'USER_NOT_VALIDATED', 404)
        }

        const hashPassword = user.password
        const check = await compare(password, hashPassword)
        
        if (!check) {
            handleHttpError(res, 'INVALID_PASSWORD', 401)
            return
        }

        //No es estrictamente necesario porque la base de datos no la devuelve
        user.set("password", undefined, { strick: false })

        const data = {
            token:  tokenSign(user),
            user
        }

        res.send(data)

    } catch (e) {
        console.log(e)
        handleHttpError(res, 'ERROR_USER_LOGIN')
        loggerStream.write(`🚨 Ha ocurrido un error crítico: ${e.message}`);
    }
}


//Funcion que comprueba que existe el usuario, genera un código que guarda en BBDD y envía por correo.
async function recoverPassword(req, res) {
    try {
        const { email } = matchedData(req);

        const user = await usersModel.findOne({ email: email });

        if (!user) return handleHttpError(res, 'USER_NOT_FOUND', 404);

        const validationCode = Math.floor(100000 + Math.random() * 900000);

        const resUpdate = await usersModel.findOneAndUpdate(
            { email: email },
            { $set : {validationCode: validationCode }},
            { new: true }
          );

        //se genera el token de recuperacion
        const tokenRecovery = tokenSignRecovery(user);

        if (!resUpdate) return handleHttpError(res);

        sendEmail({
            subject: 'Tu código de recuperación',
            text: validationCode.toString(),
            from: process.env.EMAIL,
            to: email
        });

        res.send({ message: "Código enviado al correo del usuario", token: tokenRecovery, code: validationCode })
    } catch (e) {
        console.log(e)
        handleHttpError(res)
        loggerStream.write(`🚨 Ha ocurrido un error crítico: ${e.message}`);
    }
}

async function newpassword(req, res) {
    try {
        const { newPassword1, newPassword2 } = matchedData(req);
        const { id } = req.user

        if (newPassword1 !== newPassword2) {
            return handleHttpError(res, 'PASSWORDS_DO_NOT_MATCH', 400);
        }
        const passwordHash = await encrypt(newPassword1);

        const user = await usersModel.findByIdAndUpdate(
            id,
            { $set: { password: passwordHash } },
            { new: true }
        );

        if (!user) return handleHttpError(res, 'USER_NOT_FOUND', 404)

        
        res.send({ message: "Contraseña actualizada" })
    } catch (e) {
        console.log(e)
        handleHttpError(res, 'ERROR_UPDATE_PASSWORD')
        loggerStream.write(`🚨 Ha ocurrido un error crítico: ${e.message}`);
    }
}


module.exports = { 
    registerUser, 
    loginUser, 
    recoverPassword, 
    validateUser, 
    newpassword 
}