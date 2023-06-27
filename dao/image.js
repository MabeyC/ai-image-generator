const Image = require('../models/ImageModel');

const saveImageToDb = async (file) => {
  const { fileName, size, data, contentType } = file;
    
  if(!file) {
    console.error('Invalid file param');
    return null;
  }
  try {
    const image = new Image({ fileName, data, contentType, size });
    await image.save();
    if(!image) {
      console.log('Error saving image to database');
      return false;
    }
    console.log('Image saved to db');
    return true;
  }
  catch (err) {
    console.error(err);
    return false;
  }
};

const findImageFromDb = async (fileName) => {
  try {
    const imageFile = await Image.findOne({ fileName });
    if(imageFile) {
      console.log('Found image');
      return imageFile;
    }
    else {
      console.log('File not found: ' + fileName);
       return null;
    }
  }
  catch (err) {
    console.log(err);
    console.log('No image found: ' + fileName);
    return null;
  }
};

// @TODO Create a delete function and route
const delImageFromDb = async (fileName) => {
  try {
    console.log('Delete image function. Input filename: ' + fileName);
  }
  catch (err) {
    console.log(err);
    console.log('Image could not be deleted: ' + fileName);
    return null;
  };
};

// @TODO Create a PATCH function to rename a file
const modifyImageFromDb = async (fileName, update) => {
  try {
    console.log('Edit image function. Input filename: ' + fileName);
  }
  catch (err) {
    console.log(err);
    console.log('Image could not be edited: ' + fileName);
    return null;
  }
};

module.exports = { saveImageToDb, findImageFromDb, delImageFromDb, modifyImageFromDb };