const express = require("express");
const router = express.Router();

// Controladores para manejar las rutas
const { getUsers, getUser, deleteUser, deleteAllUsers, uploadImage, updateUser, getCompany, addCompany } = require("../controllers/users");
const { validatorGetUser, validatorUpdateUser, validatorAddCompany } = require('../validators/users')
const authMiddleWare = require("../middleware/sessions")
const { uploadMiddlewareMemory } = require("../utils/handleStorage")


router.get("/", authMiddleWare, getUsers);

router.get("/company", authMiddleWare, getCompany)

router.patch("/company", authMiddleWare,validatorAddCompany, addCompany)

router.get("/:id", authMiddleWare, validatorGetUser, getUser)

router.patch ("/", authMiddleWare, validatorUpdateUser, updateUser)

router.delete("/:id", authMiddleWare, validatorGetUser, deleteUser)

router.delete("/",authMiddleWare, deleteAllUsers)

router.patch("/image", authMiddleWare, uploadMiddlewareMemory.single("image"), uploadImage)





module.exports = router;
