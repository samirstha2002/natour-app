const AppError = require('../utils/appError');
const User = require('./../models/usermodel');

const catchAsync = require('./../utils/catchAsync');
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
exports.deleteuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is route is currently not defined',
  });
};
