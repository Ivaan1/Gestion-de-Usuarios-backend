const express = require("express");
const router = express.Router();

// Controladores para manejar las rutas
const { getUsers, getUser, createUsers, deleteUser } = require("../controllers/users");
const { validatorGetUser, validatorCreateUser, validatorUpdateUser } = require('../validators/users')
const authMiddleWare = require("../middleware/sessions")

/**
 * Ruta para coger todos los usuarios registrados
 */
router.get("/", authMiddleWare, getUsers)

/**
 * Ruta para buscar un usuario por id.
 */
router.get("/:id", authMiddleWare, validatorGetUser, getUser)

/**
/**
 *Crear un nuevo usuario
 */
router.post("/", validatorCreateUser, createUsers)


/** 
 * Ruta que elimina el usuario que se indica con el id 
 */
router.delete("/:id", authMiddleWare, validatorGetUser, deleteUser)

module.exports = router;
