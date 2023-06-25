const mongoose = require('mongoose');
const { allowedContentTypes } = require('../config/image.js');

// Images are stored as Base64 strings

const ImageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  fileName: {
    type: String,
    required: true
  },
  isVariant: {
    type: Boolean,
    default: false
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
    max: [4_194_304, 'Size Cannot Exceed 4MB, got {VALUE} Bytes'] // Max 4MB
  }
});

const ImageModel = mongoose.model('Image', ImageSchema);

module.exports = ImageModel;