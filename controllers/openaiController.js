const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);



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

const generateVariantImage = async (req, res) => {
  
  const { inputImage, size, numVariants } = req.body;

  const imageSize = size == 'small' ? '256x256' : size == 'medium' ? '512x512' : '1024x1024';

  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(path.join(__dirname, '../images/test.png')),
      numVariants,
      imageSize
    );

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
      error: 'The image variants could not be generated'
    });
  }
};


module.exports = { generateImage, generateVariantImage };
