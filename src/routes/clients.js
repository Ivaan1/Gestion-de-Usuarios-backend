const express = require("express")
const router = express.Router()

// Controladores para manejar las rutas
const { getClients, getClient, createClient, archiveClient, getArchivedClients, deleteClient, restoreClient, updateClient } = require("../controllers/client")
const { validatorCreateClient, validatorGetClient, validatorUpdateClient } = require('../validators/client')
const authMiddleWare = require("../middleware/sessions")

// OBTENER TODOS los clientes relacionados a la cuenta de usuario
router.get("/", authMiddleWare, getClients)

// CREAR un cliente
router.post("/", authMiddleWare, validatorCreateClient, createClient)

// obtener TODOS los clientes ARCHIVADOS relacionados a la cuenta de usuario
router.get("/archive", authMiddleWare, getArchivedClients)

// ACTUALIZAR un cliente relacionado a la cuenta de usuario
router.put("/:id", authMiddleWare, validatorUpdateClient, updateClient)

// ARCHIVAR un cliente relacionado a la cuenta de usuario (soft delete)
router.delete("/archive/:id", authMiddleWare, archiveClient)

// DESARCHIVAR un cliente relacionado a la cuenta de usuario
router.patch("/restore/:id", authMiddleWare, validatorGetClient, restoreClient)

// ELIMINAR un cliente relacionado a la cuenta de usuario (hard delete)
router.delete("/:id", authMiddleWare, validatorGetClient, deleteClient)

// OBTENER un CLIENTE por ID relacionado a la cuenta de usuario
router.get("/:id", authMiddleWare, validatorGetClient, getClient)


module.exports = router;