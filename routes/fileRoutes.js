const express = require('express');
const router = express.Router();
const { upload, uploadImageToDb, getImageFromDb } = require('../controllers/fileController');

// @route GET /file/image/:filename
// @desc Display Image and save to disk storage
router.get('/image/:filename', getImageFromDb);

// @route POST /file/uploadimage
// @desc  Upload a single file
router.post('/uploadimage', upload.single('file'), uploadImageToDb);

module.exports = router;