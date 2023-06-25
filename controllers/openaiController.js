const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");
const ImageModel = require("../models/ImageModel");
const generateRandomString = require('../helpers/generateRandomString');
// API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Init API Connection
const openai = new OpenAIApi(configuration);

// Generate Single Image
const generateImage = async (req, res) => {
  const { prompt, size } = req.body;

  // Validate input
  // 1000 character limit
  if(prompt.length > 999) {
    return res.status(400).json({ success: false, message: 'Invalid prompt'});
  }

  const imageSize = size == 'small' ? '256x256' : size == 'medium' ? '512x512' : '1024x1024';
  const responseFormat = 'b64_json'

  try {
    // Call Api Endpoint
    const response = await openai.createImage({
      prompt: prompt, // max 1000 characters  
      n: 1, // between 1 and 10
      size: imageSize,
      response_format: responseFormat
    });

    // Disk storage Step
    // Assuming this file is one level down from the root directory
    const parentDirectory = path.resolve(__dirname, '..');
    // Save the image with a random filename
    const imagePath = parentDirectory + `/images/${generateRandomString(10)}.png`;
    // Check if the file exists
    if (fs.existsSync(imagePath)) {
      return res.status(500).json({ success: false, message: 'Error Uploading File' });
    }
    // Create a buffer for the returned image
    const imageBuffer = Buffer.from(response.data.data[0].b64_json, 'base64');
    // Save the image to disk
    await fs.writeFileSync(imagePath, imageBuffer);

    // Handle the response
    res.status(200).json({
      success: true,
      data: imageBuffer
    });   

  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }
    res.status(400).json({
      success: false,
      error: 'The image could not be generated'
    });
  }
};

// Generate Variant Image
const generateVariantImage = async (req, res) => {
  
  const { name, size, numVariants } = req.body;
  const imageSize = size == 'small' ? '256x256' : size == 'medium' ? '512x512' : '1024x1024';

  if(!name || name.length == 0) {
    return res.status(404).json({
      success: false,
      error: 'The image filename is required'
    });
  }

  // Limiting the number of variants
  if(numVariants > 3 || numVariants < 1) {
    return res.status(404).json({
      success: false,
      error: 'numVariants must be between 1 and 3'
    });
  } 

  // Image Format must be PNG
  if (!name.includes('.png')) {
    return res.status(404).json({
      success: false,
      error: 'The image must be PNG format'
    });
  }

  try {

    // Disk storage
    const parentDirectory = path.resolve(__dirname, '..');
    const imagePath = parentDirectory + `/images/${name}`;
    
    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      // No file found
      console.log(`Image does not exist in disk storage. Path: ${imagePath}` + '\n' + `Attempting to retrieve image from database...`);
      // Try to get from db
      const image = await ImageModel.findOne({ fileName: name }).exec();
      // If not found in db
      if(!image) {
        return res.status(404).json({
          success: false,
          error: 'Image file does not exist'
        });
      }
      // Found file in db
      const file = Buffer.from(image.data, 'base64');
      // Save the image to disk
      await fs.writeFileSync(imagePath, file);
    }
    // File should exist in disk storage now
    if(!fs.existsSync(imagePath)) {
      // If still no file found
      return res.status(404).json({ success: false, message: 'Image file does not exist' });
    }

    // Generate B64 instead of URL encoding
    const responseFormat = 'b64_json'

    // Call API to generate variant images
    const response = await openai.createImageVariation(
      fs.createReadStream(imagePath),
      numVariants,
      imageSize,
      responseFormat
    );

    // Handle response
    const responseDataArray = response.data.data;

    // Init array of variant images
    let imageArray = [];

    // Pushing each image to the array
    responseDataArray.forEach((file, index) => {
      // Increment filename with version
      const fileNameBeforeExtension = name.split('.png');
      const modifiedFileName = fileNameBeforeExtension.join(`_v${index + 1}` + '.png');

      const image = new ImageModel({
        fileName: modifiedFileName, // Generate a unique name for each variant
        data: file.b64_json,
        contentType: 'image/png', // Default file type returned from the API
        isVariant: true
      });
      imageArray.push(image);
    });

    // Store each variant in the database
    const savedImages = await Promise.all(imageArray.map(image => image.save()));

    res.status(200).json({
      success: true,
      data: savedImages
    });

  } catch (err) {

    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }

    res.status(400).json({
      success: false,
      error: 'The image variants could not be generated'
    });
  }
};

module.exports = { generateImage, generateVariantImage };
