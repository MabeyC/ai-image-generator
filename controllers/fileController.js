const multer = require("multer");
const { convertBytes } = require("../helpers/convertBytes");
const ImageModel = require("../models/ImageModel");
const { allowedContentTypes, imageSizeLimitInBytes } = require('../config/image');
const fs = require('fs');
const path = require('path');

// File Upload Limits
const limits = {
  // 4 MB max size
  fileSize: imageSizeLimitInBytes
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
    const { originalname, size, buffer, mimetype } = req.file;

    const image = new ImageModel({ fileName: originalname, data: buffer, contentType: mimetype, size: size });
    await image.save();

    // Convert data from b64_json to Buffer
    const imageData = Buffer.from(buffer, 'base64');
    // Write file to disk storage
    const parentDirectory = path.resolve(__dirname, '..');
    const imagePath = parentDirectory + `/images/${originalname}`;
    console.log('Saving image to disk Path:' + imagePath);
    await fs.writeFileSync(imagePath, imageData);

    res.status(200).json({ success: true, message: `Filename: ${originalname} \\n Content Type: ${mimetype}\\n Size: ${convertBytes(size, 'KB')} KB \\n Uploaded successfully` });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: 'Error uploading file'});
  }
};


// const getImageFromDb = async (req, res) => {
//   try {
//     const { filename } = req.params;
//     // Get Image from database
//     const file = await ImageModel.findOne({ fileName: filename }).exec();
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     // Write file to disk storage
//     const parentDirectory = this.path.resolve(__dirname, '..');
//     const imagePath = parentDirectory + `${path}${filename}`; 
//     console.log('Saving image to disk Path:' + imagePath);
//     await fs.writeFileSync(imagePath, file.data);

//     res.status(200).json({ success: true, image: file.data });

//   } catch (err) {
//     console.log(err.message);
//     res.status(404).json({
//       err: 'Not an image'
//     });
//   }
// };


const getImageFromDb = async (req, res) => {
  try {
    const { filename } = req.params;
    // Get Image from database
    const file = await ImageModel.findOne({ fileName: filename }).exec();
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // // Convert data from b64_json to Buffer
    // const imageData = Buffer.from(file.data, 'base64');
    // // Write file to disk storage
    // const parentDirectory = path.resolve(__dirname, '..');
    // const imagePath = parentDirectory + `/images/${filename}`;
    // console.log('Saving image to disk Path:' + imagePath);
    // await fs.writeFileSync(imagePath, imageData);

    res.status(200).json({ success: true, image: imageData });

  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      err: 'Not an image'
    });
  }
};

module.exports = { upload, uploadImageToDb, fileFilter, getImageFromDb };