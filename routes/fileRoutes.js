const express = require('express');
const router = express.Router();
const { upload, uploadImageToDb } = require('../controllers/uploadController');

router.post('/uploadimage', upload.single('file'), uploadImageToDb);

module.exports = router;