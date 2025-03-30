const express = require("express")
const { authMiddleware } = require("../middleware/sessions")
const { uploadMiddlewareMemory } = require("../utils/handleStorage")
const { updateImage } = require("../controllers/storage")
const router = express.Router()


router.patch("/", authMiddleware, uploadMiddlewareMemory.single("image"), updateImage)