const router = require('express').Router();
const { createAlbaran } = require('../controllers/albaranes');
const { validatorCreateAlbaran } = require('../validators/albaranes');
const authMiddleWare = require('../middleware/sessions');

router.post('/', authMiddleWare,validatorCreateAlbaran, createAlbaran)

module.exports = router;