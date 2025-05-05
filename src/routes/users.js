const express = require("express");
const router = express.Router();

// Controladores para manejar las rutas
const { getUsers, archiveUser, getUser, deleteUser, deleteAllUsers, uploadImage, updateUser, getCompany, addCompany, restoreUser } = require("../controllers/users");
const { validatorGetUser, validatorUpdateUser, validatorAddCompany } = require('../validators/users')
const authMiddleWare = require("../middleware/sessions")
const { uploadMiddlewareMemory } = require("../utils/handleStorage")


router.get("/", authMiddleWare, getUsers);

router.delete("/",authMiddleWare, deleteAllUsers)

router.patch ("/", authMiddleWare, validatorUpdateUser, updateUser)

router.get("/company", authMiddleWare, getCompany)

router.patch("/company", authMiddleWare,validatorAddCompany, addCompany)

router.patch("/archive", authMiddleWare, archiveUser)

router.patch("/restore", authMiddleWare, restoreUser)

router.patch("/image", authMiddleWare, uploadMiddlewareMemory.single("image"), uploadImage)

router.get("/:id", authMiddleWare, validatorGetUser, getUser)

router.delete("/:id", authMiddleWare, validatorGetUser, deleteUser)









module.exports = router;
