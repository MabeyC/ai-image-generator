const multer = require("multer");
const { allowedContentTypes, imageSizeLimitInBytes } = require('../utils/image');

// @TODO combine both file size and type into one function

// File Upload Limits
const limits = {
  fileSize: imageSizeLimitInBytes // 4 MB max size
};

// File Upload Type Filter
function fileFilter (req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
 
  if(allowedContentTypes.includes(file.mimetype)) {
    console.log(`File type: ${file.mimetype} accepted.`);
    // To accept the file pass `true`, like so:
    cb(null, true);
  } else {
    console.log(`File type: ${file.mimetype} not accepted.`);
    // To reject this file pass `false`, like so:
    cb(null, false);
  }
}

// Init DB Image Upload Tool
// Create Multer upload middleware with memory storage
const handleImageFile = multer({ 
  storage: multer.memoryStorage(), // save to memory storage
  limits: limits, // Image size limit
  fileFilter: fileFilter
});

module.exports = { handleImageFile };