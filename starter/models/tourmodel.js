const mongoose = require('mongoose');
const slugify = require('slugify');
const tourschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have name'],
      unique: true,
    },
    slug: String,

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

    ratingsQuantity: {
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
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
tourschema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});

tourschema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourschema.pre('save', function (next) {
  console.log('will save');
  next();
});

tourschema.post('save', function (doc, next) {
  console.log(doc);
  next();
});
const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
