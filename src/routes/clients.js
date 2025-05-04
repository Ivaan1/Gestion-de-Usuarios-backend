const express = require("express")
const router = express.Router()

// Controladores para manejar las rutas
const { getClients, createClient } = require("../controllers/client")
const { validatorCreateClient, validatorGetClient } = require('../validators/client')
const authMiddleWare = require("../middleware/sessions")

router.get("/", authMiddleWare, getClients)
router.post("/", authMiddleWare, validatorCreateClient, createClient)

module.exports = router;