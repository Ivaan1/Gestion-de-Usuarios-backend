const express = require("express")
const { validatorRegister, validatorLogin, validatorValidation, validatorRecoverPassword, validatorNewPassword } = require("../validators/auth")
const { registerUser, loginUser, recoverPassword, validateUser, newpassword } = require('../controllers/auth')
const router = express.Router()
const authMiddleWare = require("../middleware/sessions")
const { validateUserMiddleware } = require("../middleware/validated") //verifica si el usuario ya ha sido validado (validated == true)

router.post("/register", validatorRegister, registerUser)

router.post("/login", validatorLogin, loginUser)

/**
 * Endpoint POST /recovery
 * Recuperacion de contraseña, se envia un correo al usuario.
 */
router.post("/recovery", validatorRecoverPassword, recoverPassword)

/**
 * Endpoint POST /validation
 * Validacion de usuario, se valida el usuario con el codigo enviado al correo.
 */
router.post("/validation", authMiddleWare, validatorValidation, validateUser)

/**
 * Endpoint POST /newpassword
 * Cambia la contraseña del usuario
 */
router.patch("/newpassword", authMiddleWare ,validateUserMiddleware, validatorNewPassword, newpassword );

module.exports = router