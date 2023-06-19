const express = require('express');
const router = express.Router();
const { generateImage, generateVariantImage } = require('../controllers/openaiController');
const { upload, uploadImageToDb } = require('../controllers/uploadController');

router.post('/generateimage', generateImage);

router.post('/variantimage', generateVariantImage);

router.post('/uploadimage', upload.single('file'), uploadImageToDb);

module.exports = router;