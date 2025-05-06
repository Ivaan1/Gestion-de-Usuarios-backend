const express = require("express")
const { validatorRegister, validatorLogin, validatorValidation, validatorRecoverPassword } = require("../validators/auth")
const { registerUser, loginUser, recoverPassword, validateUser } = require('../controllers/auth')
const router = express.Router()
const authMiddleWare = require("../middleware/sessions")
const { validateUserMiddleware } = require("../middleware/validated")

router.post("/register", validatorRegister, registerUser)

router.post("/login", validatorLogin, validateUserMiddleware, loginUser)

router.post("/recovery", validatorRecoverPassword,validateUserMiddleware, recoverPassword)

router.post("/validation", authMiddleWare, validatorValidation, validateUserMiddleware, validateUser)


module.exports = router