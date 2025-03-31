const { matchedData } = require('express-validator')
const { encrypt, compare } = require('../utils/handlePassword')
const { tokenSign } = require('../utils/handleJWT')
const { usersModel } = require('../models')
const { handleHttpError } = require('../utils/handleErrors')
const { sendEmail } = require("../utils/handleEmail")

async function registerUser(req, res) {
    try {
        req = matchedData(req)

        const validationCode = Math.floor(100000 + Math.random() * 900000);


        const password = await encrypt(req.password)
        //Se duplica el cuerpo pero se sobreescribe la contraseña para que en la base de datos se guarde encriptada
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
            token: await tokenSign(dataUser),
            user: dataUser,
            isVerified: false
        }

        res.send(data)
    } catch (e) {
        if (e.error === 1100) {
            console.log("Ese correo ya existe en la base de datos")
            handleHttpError(res, 'EMAIL_ERROR', 409)
        } else {
            console.log(e)
            handleHttpError(res, 'REGISTER_ERROR')
        }
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
        console.log("code : " + code)
        console.log("user code : " + user.validationCode)
        if (code === user.validationCode) {
            const validated = true
            const response = await usersModel.findByIdAndUpdate(id, { $set: { validated } }, { new: true })
            console.log("Usuario validado")
            res.send(response)
        } else {
            const tries = Number(user.tries) - 1
            const response = await usersModel.findByIdAndUpdate(id, { $set: { tries } }, { new: true })
            console.log("Código inválido")
            res.send(response)
        }

    } catch (e) {
        console.log(e)
        handleHttpError(res, 'VALIDATION_ERROR')
    }
}


//TODO: Los errores tienen que ser los mismos en producción para frena la fuerza bruta
async function loginUser(req, res) {
    try {
        const { email, password } = matchedData(req)

        const user = await usersModel.findOne({ email: email }).select("password name role email discipline")

        if (!user) {
            handleHttpError(res, 'USER_NOT_EXISTS', 404)
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
            token: await tokenSign(user),
            user
        }

        res.send(data)
    } catch (e) {
        console.log(e)
        handleHttpError(res, 'ERROR_USER_LOGIN')
    }
}

async function updatePassword(req, res) {
    try {
        const { email, code, oldPassword, newPassword1, newPassword2 } = matchedData(req);

        if ((!code && !oldPassword) || !newPassword1 || !newPassword2) {
            return handleHttpError(res, "Faltan datos en la solicitud", 400);
        }

        // Comparo que sea la misma contraseña
        if (newPassword1 !== newPassword2) {
            return handleHttpError(res, 'ERROR_DIFFERENT_PASSWORDS', 400);
        }

        // Busco el usuario
        const user = await usersModel.findOne({ email: email }).select("password validationCode");

        if (!user) return handleHttpError(res, 'USER_NOT_FOUND', 404);


        if (oldPassword) {
            // Compruebo que la contraseña enviada y la guardada sean la misma
            const check = await compare(oldPassword, user.password);
            if (!check) return handleHttpError(res, 'INVALID_PASSWORD', 401);
        } else if (code) {
            // Compruebo que los códigos son iguales
            if (code != user.validationCode) return handleHttpError(res, 'CODE_INVALID', 404);
        } else {
            return handleHttpError(res, 'OLDPASS_OR_CODE_NEEDED', 404)
        }

        // Hasheo la nueva contraseña
        const newPassword = await encrypt(newPassword1);

        // Actualizo el campo de la contraseña
        const data = await usersModel.findByIdAndUpdate(user.id, { $set: { password: newPassword } }, { new: true });

        if (!data) return handleHttpError(res, 'ERROR_UPDATING_PASSWORD');

        res.send({ message: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.error("Error en updatePassword:", error);
        handleHttpError(res, 'ERROR_UPDATE_PASSWORD', 500);
    }
}

//Funcion que comprueba que existe el usuario, genera un código que guarda en BBDD y envía por correo.
async function recoverPassword(req, res) {
    try {
        const { email } = matchedData(req);

        const user = await usersModel.findOne({ email: email });

        if (!user) return handleHttpError(res, 'USER_NOT_FOUND', 404);

        const validationCode = Math.floor(100000 + Math.random() * 900000);

        const resUpdate = await usersModel.findOneAndUpdate({email: email}, { $set: { validationCode: validationCode } }, { new: true });

        if (!resUpdate) return handleHttpError(res);

        sendEmail({
            subject: 'Tu código de recuperación',
            text: validationCode.toString(),
            from: process.env.EMAIL,
            to: email
        });

        res.send({ message: "Enviado código de recuperación de contraseña" });
    } catch (e) {
        console.log(e)
        handleHttpError(res)
    }
}

module.exports = { registerUser, loginUser, updatePassword, recoverPassword, validateUser }