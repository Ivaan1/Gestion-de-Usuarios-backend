const router = require('express').Router();
const { createAlbaran, getAlbaranes, getAlbaran, generatePDF, downloadPDF, uploadSign, deleteAlbaran } = require('../controllers/albaranes');
const { validatorCreateAlbaran, validatorGetAlbaran } = require('../validators/albaranes');
const authMiddleWare = require('../middleware/sessions');
const { uploadMiddlewareMemory } = require("../utils/handleStorage")
const { validateUserMiddleware } = require("../middleware/validated")


router.post('/', authMiddleWare,validatorCreateAlbaran,validateUserMiddleware, createAlbaran)

router.get('/', authMiddleWare,validateUserMiddleware, getAlbaranes)

router.patch('/pdf/:id', authMiddleWare, validatorGetAlbaran,validateUserMiddleware, generatePDF)
router.get('/pdf/:id', authMiddleWare,validatorGetAlbaran,validateUserMiddleware, downloadPDF)

router.patch('/sign/:id', authMiddleWare, validatorGetAlbaran,validateUserMiddleware, uploadMiddlewareMemory.single("image"), uploadSign)

router.get('/:id', authMiddleWare, validatorGetAlbaran,validateUserMiddleware, getAlbaran)

router.delete('/:id', authMiddleWare, validatorGetAlbaran,validateUserMiddleware, deleteAlbaran)

module.exports = router;