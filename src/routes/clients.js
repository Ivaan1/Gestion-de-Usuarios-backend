const express = require("express")
const router = express.Router()

// Controladores para manejar las rutas
const { getClients, getClient, createClient, archiveClient, getArchivedClients, deleteClient, restoreClient, updateClient, getProjectOfClient, deleteAllClients } = require("../controllers/clients")
const { validatorCreateClient, validatorGetClient, validatorUpdateClient } = require('../validators/clients')
const authMiddleWare = require("../middleware/sessions")
const { validateUserMiddleware } = require("../middleware/validated")

// OBTENER TODOS los clientes relacionados a la cuenta de usuario
router.get("/", authMiddleWare,validateUserMiddleware, getClients)

// CREAR un cliente
router.post("/", authMiddleWare, validatorCreateClient,validateUserMiddleware, createClient)

//SOLO USAR PARA PRUEBAS
router.delete("/", deleteAllClients);

// obtener TODOS los clientes ARCHIVADOS relacionados a la cuenta de usuario
router.get("/archive", authMiddleWare, getArchivedClients)

// ACTUALIZAR un cliente relacionado a la cuenta de usuario
router.put("/:id", authMiddleWare, validatorUpdateClient,validateUserMiddleware, updateClient)

// ARCHIVAR un cliente relacionado a la cuenta de usuario (soft delete)
router.delete("/archive/:id", authMiddleWare, archiveClient)

// DESARCHIVAR un cliente relacionado a la cuenta de usuario
router.patch("/restore/:id", authMiddleWare, validatorGetClient,validateUserMiddleware, restoreClient)

// ELIMINAR un cliente relacionado a la cuenta de usuario (hard delete)
router.delete("/:id", authMiddleWare, validatorGetClient,validateUserMiddleware, deleteClient)

// OBTENER un CLIENTE por ID relacionado a la cuenta de usuario
router.get("/:id", authMiddleWare, validatorGetClient,validateUserMiddleware, getClient)

//OBTENER los PROYECTOS de un CLIENTE
router.get("/:id/projects", authMiddleWare, validatorGetClient,validateUserMiddleware, getProjectOfClient)



module.exports = router;