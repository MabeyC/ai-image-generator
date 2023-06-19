const multer = require("multer");
const { convertBytes, convertMegaBytesToBytes} = require("../helpers/convertBytes");
const ImageModel = require("../models/ImageModel");

// File Upload Limits
const limits = {
  // 4 MB max size
  fileSize: Math.round(1048576 * 4)  
};

// File Upload Type Filter
function fileFilter (req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  
  if(acceptedFileTypes.includes(file.mimetype)) {
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
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: limits,
  fileFilter: fileFilter
});

// Use upload middleware to access the file data from the request object (req.file)
// example: app.post('/upload', upload.single('file'), (req, res) => {
//  const { originalname, buffer } = req.file
//  res.send(200).json({ success: true, name: originalname});
// });

const uploadImageToDb = async (req, res) => {
  try {
    const { originalname, size, buffer } = req.file;

    const image = new ImageModel({ fileName: originalname, data: buffer });
    await image.save();

    res.status(200).json({ success: true, message: `Filename ${originalname} uploaded successfully. \n Total file size: ${convertBytes(size, 'KB')} KBs` });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: 'Error uploading file'});
  }
};

module.exports = { upload, uploadImageToDb, fileFilter };