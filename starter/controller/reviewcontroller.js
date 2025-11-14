const AppError = require('../utils/appError');
const Review = require('./../models/reviewmodel');
const catchAsync = require('./../utils/catchAsync');

exports.getallreviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'sucess',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

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

exports.createreview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'sucess',
    data: {
      review: newReview,
    },
  });
});
