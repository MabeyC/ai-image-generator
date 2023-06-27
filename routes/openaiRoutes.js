const express = require('express');
const router = express.Router();
const { generateImage, generateVariantImage } = require('../controllers/openaiController');
const { upload, uploadImageToDb } = require('../controllers/fileController');

// @TODO Change these routes to protected routes

// @route   POST /openai/generateimage
// @desc    Generates an image based on a prompt
// @access  Public
router.post('/generateimage', generateImage);

// @route   POST /openai/variantimage
// @desc    Generates variant images based on an image
// @access  Public
router.post('/variantimage', generateVariantImage);

module.exports = router;