const mongoose = require('mongoose');
const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a tour must have name'],
    unique: true,
  },

  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'a tour must have price'],
  },
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
