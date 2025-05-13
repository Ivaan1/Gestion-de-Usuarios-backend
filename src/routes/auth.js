const express = require("express")
const { validatorRegister, validatorLogin, validatorValidation, validatorRecoverPassword } = require("../validators/auth")
const { registerUser, loginUser, recoverPassword, validateUser } = require('../controllers/auth')
const router = express.Router()
const authMiddleWare = require("../middleware/sessions")
const { validateUserMiddleware } = require("../middleware/validated")

router.post("/register", validatorRegister, registerUser)

router.post("/login", validatorLogin, loginUser)

router.post("/recovery", validatorRecoverPassword, recoverPassword)

router.post("/validation", authMiddleWare, validatorValidation, validateUser)


module.exports = router