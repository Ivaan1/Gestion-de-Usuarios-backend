const router = require('express').Router();
const { createAlbaran, getAlbaranes, getAlbaran, generatePDF, downloadPDF, uploadSign, deleteAlbaran } = require('../controllers/albaranes');
const { validatorCreateAlbaran, validatorGetAlbaran } = require('../validators/albaranes');
const authMiddleWare = require('../middleware/sessions');
const { uploadMiddlewareMemory } = require("../utils/handleStorage")

router.post('/', authMiddleWare,validatorCreateAlbaran, createAlbaran)

router.get('/', authMiddleWare, getAlbaranes)

router.patch('/pdf/:id', authMiddleWare, validatorGetAlbaran, generatePDF)
router.get('/pdf/:id', authMiddleWare,validatorGetAlbaran, downloadPDF)

router.patch('/sign/:id', authMiddleWare, validatorGetAlbaran, uploadMiddlewareMemory.single("image"), uploadSign)

router.get('/:id', authMiddleWare, validatorGetAlbaran, getAlbaran)

router.delete('/:id', authMiddleWare, validatorGetAlbaran, deleteAlbaran)

module.exports = router;