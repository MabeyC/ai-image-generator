const mongoose = require('mongoose');

// Images are stored as Base64 strings

const ImageSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  }
});

const ImageModel = mongoose.model('Image', ImageSchema);

module.exports = ImageModel;