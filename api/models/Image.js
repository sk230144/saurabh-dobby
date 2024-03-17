const { Schema, model } = require('mongoose');

const ImageSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const ImageModel = model('Image', ImageSchema);

module.exports = ImageModel;
