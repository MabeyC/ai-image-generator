const express = require('express');
const router = express.Router();
const { generateImage, generateVariantImage } = require('../controllers/openaiController');

router.post('/generateimage', generateImage);

router.post('/variantimage', generateVariantImage);

module.exports = router;