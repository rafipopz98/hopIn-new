const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
  // Other details related to the place can be added here in the future
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
