const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");
const ImageModel = require("../models/ImageModel");

// API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Init API Connection
const openai = new OpenAIApi(configuration);

// Generate Single Image
const generateImage = async (req, res) => {
  const { prompt, size } = req.body;

  const imageSize = size == 'small' ? '256x256' : size == 'medium' ? '512x512' : '1024x1024';

  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: imageSize,
    });

    const imageUrl = response.data.data[0].url;

    res.status(200).json({
      success: true,
      data: imageUrl
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

  // Limiting the number of variants to 3
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
      // Save the image to disk
      await fs.writeFileSync(imagePath, image.data);
    }
    // File should exist in disk storage now
    if(!fs.existsSync(imagePath)) {
      // If still no file found
      return res.status(404).json({ success: false, message: 'Image file does not exist' });
    }
    // Call API to generate variant images
    const response = await openai.createImageVariation(
      fs.createReadStream(imagePath),
      numVariants,
      imageSize
    );

    // Handle response
    const responseDataArray = response.data.data;
    const imageUrls = responseDataArray.map(i => i.url);
    res.status(200).json({
      success: true,
      data: imageUrls
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
