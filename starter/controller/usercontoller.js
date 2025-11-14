const AppError = require('../utils/appError');
const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controller/handlerfactoryfunction');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getallusers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // send responses
  res.status(200).json({
    status: 'sucess',
    results: users.length,

    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user posts password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for updating the password . please use the /updatepassword route',
        400,
      ),
    );
  }

  // filtered out unwanted field that doesnot need to be updated

  const filteredBody = filterObj(req.body, 'name', 'email');

  // updated user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});
exports.getuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is route is currently not defined',
  });
};

exports.createuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is route is currently not defined',
  });
};
exports.updateuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is route is currently not defined',
  });
};
exports.deleteuser = factory.deleteOne(User);
