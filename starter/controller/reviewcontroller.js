// const AppError = require('../utils/appError');
const Review = require('./../models/reviewmodel');
const Booking = require('./../models/bookingmodel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controller/handlerfactoryfunction');

exports.getallreviews = factory.getAll(Review);

//catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId)
//     filter = {
//       tour: req.params.tourId,
//     };
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'sucess',
//     result: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// exports.getreview = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) {
//     return next(new AppError('No review  found with that Id', 404));
//   }
//   res.status(200).json({
//     status: 'sucess',
//     // results: tours.length,
//     data: {
//       review,
//     },
//   });
// });

exports.settouruserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// exports.createreview = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'sucess',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.getreview = factory.getOne(Review);
exports.createreview = factory.createOne(Review);

exports.updatereviews = factory.updateOne(Review);
exports.deletereviews = factory.deleteOne(Review);
