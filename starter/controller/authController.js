const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createsendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;

  res.cookie('jwt', token, cookieOption);
  res.status(statusCode).json({
    status: 'sucess',
    token,
    data: {
      user,
    },
  });
};
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  let passwordChangedAt;
  if (req.body.passwordChangedAt) {
    passwordChangedAt = new Date(req.body.passwordChangedAt);
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt,
    role: req.body.role,
  });
  createsendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and pasword exist

  if (!email || !password) {
    return next(new AppError('Please Provide Email and Password', 400));
  }

  //2) check if user exists and pasword is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email and password', 401));
  }

  //3) send token to client if everything is ok
  createsendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) getting token and checck if it exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('you are not logged in ! please log in ', 401));
  }
  // verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // check if user still exist
  const freshuser = await User.findById(decoded.id);
  if (!freshuser) {
    return next(
      new AppError('The user belonging to this token dosnot exist', 401),
    );
  }

  // check if user changed password after token has expired
  if (freshuser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('user recently changed the password', 401));
  }
  // grant acess to protected user
  req.user = freshuser;
  res.locals.user = freshuser;

  next();
});

//only for rendered pages ,no error
exports.isloggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // Check if user still exists
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) return next();

      // Check if user changed password after token was issued
      if (freshUser.changedPasswordAfter(decoded.iat)) return next();

      // There is a logged-in user
      res.locals.user = freshUser;
    } catch (err) {
      return next(); // Invalid token, just continue
    }
  }
  next(); // Always call next() once
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You donot have permission to perform this action ', 403),
      );
    }

    next();
  };
};
exports.forgetPassword = catchAsync(async (req, res, next) => {
  //1)get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  //2) generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3 send it to users email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forget your password? Submit Patch Request with new Password & passwordConfirm to :${resetURL}.\n if  you didnot forget ignore this message `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'sucess',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was error sending email,try again later!', 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token is not expired and there is user set new password
  if (!user) {
    return next(new AppError('Incorrect token or token has expired ', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createsendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2)check if posted password correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('the current password is incorrect', 401));
  }

  //if so update passsword
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // log user in , send jwt

  createsendToken(user, 201, res);
});
