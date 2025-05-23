const express = require("express");
const router = express.Router();

// Controladores para manejar las rutas
const { getUsers, archiveUser, getUser, getLoggedUser, deleteUser, deleteAllUsers, uploadImage, updateUser, getCompany, addCompany, restoreUser } = require("../controllers/users");
const { validatorGetUser, validatorUpdateUser, validatorAddCompany } = require('../validators/users')
const authMiddleWare = require("../middleware/sessions")
const { uploadMiddlewareMemory } = require("../utils/handleStorage")
const { validateUserMiddleware } = require("../middleware/validated")

router.get("/", authMiddleWare, validateUserMiddleware, getUsers);

router.get("/me", authMiddleWare, validateUserMiddleware, getLoggedUser);
// Solo usar para pruebas
router.delete("/", deleteAllUsers)

router.patch ("/", authMiddleWare, validatorUpdateUser,validateUserMiddleware, updateUser)

router.get("/company", authMiddleWare,validateUserMiddleware, getCompany)

router.patch("/company", authMiddleWare,validatorAddCompany,validateUserMiddleware, addCompany)

router.patch("/archive", authMiddleWare,validateUserMiddleware, archiveUser)

router.patch("/restore", authMiddleWare,validateUserMiddleware, restoreUser)

router.patch("/image", authMiddleWare,validateUserMiddleware, uploadMiddlewareMemory.single("image"), uploadImage)

router.get("/:id", authMiddleWare, validatorGetUser, validateUserMiddleware, getUser)

router.delete("/:id", authMiddleWare, validatorGetUser,validateUserMiddleware, deleteUser)









module.exports = router;
