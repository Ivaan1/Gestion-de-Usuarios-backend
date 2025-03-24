const express = require("express");
const router = express.Router();

// Controladores para manejar las rutas
const { getUsers, getUser, createUsers, deleteUser } = require("../controllers/users");

/**
 * Ruta para coger todos los usuarios registrados
 */
router.get("/", getUsers);

/**
 * Ruta para buscar un usuario por id.
 */
router.get("/:id", getUser);

/**
 * Ruta para crear un nuevo usuario
 */
router.post("/", createUsers);

/**
 * Ruta para eliminar un usuario por id.
 */
router.delete("/:id", deleteUser);

module.exports = router;
