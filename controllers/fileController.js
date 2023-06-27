const { errorHandler } = require('../utils/errorHandler');
const { saveImageToDb, findImageFromDb, delImageFromDb, modifyImageFromDb } = require('../dao/image');
const { convertBytes } = require("../helpers/convertBytes");

const uploadImageToDb = async (req, res) => {
  const { originalname, size, buffer, mimetype } = req.file;

  if(!req.file) {
    console.log('Error, Invalid file param');
    return errorHandler({ statusCode: 400, message: 'Invalid file' }, req, res);
  }

  try {
    const savedImage = await saveImageToDb({ fileName: originalname, data: buffer, contentType: mimetype, size: size });
    if(savedImage) {
      return res
      .status(200)
      .json({ 
        success: true, 
        message: 'File Saved To Db', 
        data: { 
          fileName: originalname, 
          contentType: mimetype,
          size: convertBytes(size, 'KB') + 'KB'
        }
      });
    } else {
      return errorHandler({ statusCode: 500, message: 'Error uploading file' }, req, res);
    }
  } catch (err) {
    console.log(err.message);
    return errorHandler({ statusCode: 500, message: 'Error uploading file' }, req, res);
  }
};

const getImageFromDb = async (req, res) => {
  const { filename } = req.params;
  
  try {
    const imageFile = await findImageFromDb(filename);
    if(imageFile) {
      return res.status(200).json({ success: true, image: imageFile.data });
    } else {
      return errorHandler({ statusCode: 500, message: 'Unable to save image to disk'}, req, res);
    }
  } catch (err) {
    console.log(err);
    return errorHandler({ statusCode: 400, message: 'Unable to get image from db' }, req, res);
  }
};

// @TODO create delete route
// Untested
const deleteImageFromDB = async (req, res) => {
  const { filename } = req.params;
  if(!filename) {
    return errorHandler({ statusCode: 400, message: 'Invalid filename param'}, req, res);
  }
  
  try {
    const deletedImage = await delImageFromDb(filename);
    if(deletedImage) {
      return res.status(200).json({ success: true, message: 'Image successfully deleted from db' });
    }
    else {
      console.log('Image not deleted');
      return errorHandler({ statusCode: 500, message: 'Unable to delete image from db' }, req, res);
    }
  }
  catch (err) {
    console.log(err);
    return errorHandler({ statusCode: 400, message: 'Unable to delete image from db' }, req, res);
  }
};

// @TODO create edit route
// Untested
const editImageFromDB = async (req, res) => {
  // Do we want to accept json or body here? 
  const { filename, updatedFileName } = req.params;
  try {
    // Check if the file exists in the database
    const imageFile = await findImageFromDb(filename);
    if(imageFile) {
      // We have the image file, update the image with the new parameters, maybe do this inside the image dao folder?
      // Update image
    }
    else {
      return errorHandler({ statusCode: 400, message: 'Unable to edit image from db' }, req, res);
    }
  }
  catch (err) {
    console.log(err);
    return errorHandler({ statusCode: 400, message: 'Unable to edit image from db' }, req, res);
  }
};

module.exports = { uploadImageToDb, getImageFromDb, deleteImageFromDB, editImageFromDB };