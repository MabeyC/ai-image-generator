const express = require('express');
const router = express.Router();
const { uploadImageToDb, getImageFromDb, deleteImageFromDB, editImageFromDB  } = require('../controllers/fileController');
const { handleImageFile } = require('../middleware/file');
const { authSession } = require('../middleware/session');

// @TODO All routes in this file should be protected and need to create missing routes

// @route   POST /file/uploadimage
// @desc    Upload a single file
// @access  Protected
router.post('/uploadimage', handleImageFile.single('file'), uploadImageToDb);

// @route   GET /file/image/:filename
// @desc    Display Image and save to disk storage
// @access  Protected
router.get('/image/:filename', getImageFromDb);

// @route   DELETE /file/image/:filename
// @desc    Delete a single file
// @access  Protected
router.delete('/image/:filename', deleteImageFromDB);

// @route   PATCH /file/image/:filename
// @desc    Upload a single file
// @access  Protected
router.patch('/image/:filename', editImageFromDB);


module.exports = router;