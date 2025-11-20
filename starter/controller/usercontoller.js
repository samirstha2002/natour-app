const multer = require('multer');
const AppError = require('../utils/appError');
const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./../controller/handlerfactoryfunction');
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'starter/public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image .please uplaod an image '));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getme = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getallusers = factory.getAll(User);
// catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   // send responses
//   res.status(200).json({
//     status: 'sucess',
//     results: users.length,

//     data: {
//       users,
//     },
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user posts password data
  console.log(req.file);
  console.log(req.body);
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
exports.getuser = factory.getOne(User);

exports.createuser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is route is not defined.please use /signup',
  });
};
exports.updateuser = factory.updateOne(User);
exports.deleteuser = factory.deleteOne(User);
