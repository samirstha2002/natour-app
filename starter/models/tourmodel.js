const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./usermodel');
const tourschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have name'],
      unique: true,
      maxlength: [40, 'a tour name must have less or equal to 40 letters'],
      minlength: [10, ' a tour name must have more or equal to 10 letters'],
      //   validate: [validator.isAlpha, 'a tour name must have all characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: ' difficulty must be either:easy,medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be below 5'],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // 'this' only points to the current document on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },

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
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourschema.index({ price: 1, ratingsAverage: -1 });
tourschema.index({ slug: 1 });

tourschema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});
// virtual populate
tourschema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourschema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourschema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

// tourschema.pre('find', function (next) {
tourschema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourschema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
tourschema.post(/^find/, function (docs, next) {
  console.log(`the query took ${Date.now() - this.start} milli second`);
  //   console.log(docs);
  next();
});

tourschema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
// tourschema.pre('save', function (next) {
//   console.log('will save');
//   next();
// });

// tourschema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
