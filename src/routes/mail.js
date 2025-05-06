const express = require("express")
const { validatorMail } = require("../validators/mail")
const { send } = require("../controllers/mail")
const router = express.Router()


router.post("/mail", validatorMail, send)

module.exports = router