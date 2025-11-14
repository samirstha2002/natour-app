const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ApiFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document  found with that Id', 404));
    }
    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document  found with that Id', 404));
    }
    res.status(200).json({
      status: 'sucess',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that Id', 404));
    }
    res.status(200).json({
      status: 'sucess',
      // results: tours.length,
      data: {
        data: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //  to allow for nested get reviews on tour(hack)
    let filter = {};
    if (req.params.tourId)
      filter = {
        tour: req.params.tourId,
      };
    // page not existing error handling'
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // execute the query
    const doc = await features.query;
    // send responses
    res.status(200).json({
      status: 'sucess',
      results: doc.length,

      data: {
        data: doc,
      },
    });
  });
