const fs = require('fs');
const path = require('path');

/**writeImageToDisk Function Usage
 * const parentDirectory = path.resolve(__dirname, '..');
 * const imagePath = parentDirectory + `/images/`;
 * await writeImageToDisk({ fileName: originalname, filePath: imagePath, buffer: buffer})
 * 
 */
  
const writeImageToDisk = async ({ fileName, filePath, buffer }) => {
  if(!buffer || !fileName || !filePath) {
    console.log('Invalid params');
    return false;
  }

  try {
    const imageBuffer = Buffer.from(buffer, 'base64');
    const completeFilePath = path.join(filePath, fileName);
    
    const fileExists = await fs.existsSync(completeFilePath);
    if(fileExists) {
      // File already exists
      console.log('File already exists: ' + completeFilePath);
      return false;
    }
    // File does not exist
    const savedImage = await fs.writeFileSync(completeFilePath, imageBuffer);
    console.log('Saving image to disk...Path:' + completeFilePath);
    
    if(savedImage) {
      return true;
    }
  }
  catch(err) {
    console.log(err);
    return null;
  }
};

const readImageFromDisk = async ({ fileName, filePath }) => {
  if(!fileName || !filePath) {
    console.log('Invalid params');
    return null;
  }

  try {
    const completeFilePath = path.join(filePath, fileName);
    // Check if the file exists
    const fileExists = await fs.existsSync(completeFilePath);
    if(fileExists) {
      // File exists
      const imageFile = await fs.readFileSync(completeFilePath);
      const imageBuffer = Buffer.from(imageFile, 'base64');
      if(imageBuffer){
        console.log('File found at path: ' + completeFilePath);
        return imageBuffer;
      } else {
        console.log('Unable to Buffer Image: ' + imageBuffer);
        return false;
      }
    } else {
      // File does not exist
      console.log('File does not exist at path: ' + completeFilePath);
      return false;
    }
  }
  catch(err) {
    console.log(err);
    return null;
  }
};

module.exports = { writeImageToDisk, readImageFromDisk };