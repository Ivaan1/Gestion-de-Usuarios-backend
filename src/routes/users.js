const express = require("express");
const router = express.Router();

// Controladores para manejar las rutas
const { getUsers, getUser, createUsers, deleteUser, deleteAllUsers, uploadImage } = require("../controllers/users");
const { validatorGetUser, validatorCreateUser, validatorUpdateUser } = require('../validators/users')
const authMiddleWare = require("../middleware/sessions")

const { uploadMiddlewareMemory } = require("../utils/handleStorage")

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

/**
 * Ruta que elimina a todos los usuarios
 */
router.delete("/",authMiddleWare, deleteAllUsers)


router.patch("/image", authMiddleWare, uploadMiddlewareMemory.single("image"), uploadImage)


module.exports = router;
