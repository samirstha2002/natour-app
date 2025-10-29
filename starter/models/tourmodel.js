const mongoose = require('mongoose');
const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a tour must have name'],
    unique: true,
  },

  duration: {
    type: Number,
    required: [true, 'a tour must have duration'],
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'a tour must have groupsize'],
  },
  difficulty: {
    type: String,
    required: [true, 'a tour must have difficulty'],
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
  },

  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'a tour must have price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'a tour  must have the summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, ' a tour must have cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
