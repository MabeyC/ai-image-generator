const mongoose = require('mongoose');
const { allowedContentTypes } = require('../config/image.js');

// Images are stored as Base64 strings

const ImageSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    enum: {
      values: allowedContentTypes,
      message: 'Filetype {VALUE} is not supported'
    }
  },
  sizeBytes: {
    type: Number,
    max: [4_194_304, 'Size Cannot Exceed 4,194,304 Bytes, got {VALUE} Bytes'] // Max 4MB
  }
});

const ImageModel = mongoose.model('Image', ImageSchema);

module.exports = ImageModel;