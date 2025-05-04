const express = require("express")
const { validatorRegister, validatorLogin, validatorNewPassword, validatorValidation, validatorRecoverPassword } = require("../validators/auth")
const { registerUser, loginUser, updatePassword, recoverPassword, validateUser } = require('../controllers/auth')
const router = express.Router()
const authMiddleWare = require("../middleware/sessions")

//POSTS
router.post("/register", validatorRegister, registerUser)
router.post("/login", validatorLogin, loginUser)
router.post("/recovery", validatorRecoverPassword, recoverPassword)
router.post("/validation", authMiddleWare,validatorValidation, validateUser)

//PATCHS
router.patch("/newpassword", validatorRecoverPassword, validatorNewPassword, updatePassword)

module.exports = router