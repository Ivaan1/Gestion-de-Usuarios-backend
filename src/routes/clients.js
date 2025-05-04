const express = require("express")
const router = express.Router()

// Controladores para manejar las rutas
const { getClients, getClient, createClient, archiveClient, getArchivedClients } = require("../controllers/client")
const { validatorCreateClient, validatorGetClient } = require('../validators/client')
const authMiddleWare = require("../middleware/sessions")

router.get("/", authMiddleWare, getClients)
router.post("/", authMiddleWare, validatorCreateClient, createClient)
router.get("/archive", authMiddleWare, getArchivedClients)

router.delete("/archive/:id", authMiddleWare, archiveClient)

router.get("/:id", authMiddleWare, validatorGetClient, getClient)


module.exports = router;