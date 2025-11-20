const AppError = require('../utils/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0]; // e.g., "name"
  const value = Object.values(err.keyValue)[0]; // e.g., "Test Tour"
  const message = `Duplicate field value: ${field} = "${value}". Please use another value.`;

  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data:${errors.join('.')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token, PLease log in  again', 401);
};

const handleTokenExpireError = () => {
  return new AppError('Token has been expired', 401);
};
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,

      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error('Error', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, req, res) => {
  // A) Api
  if (req.originalUrl.startsWith('/api')) {
    //operational trusted error:send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //programming or other unknown error:don't leak the err details
      console.error('Error', err);
      return res.status(500).json({
        status: 'error',
        message: 'Something Went  Very Wrong',
      });
    }
  } else {
    // B) RENDERING WEBSITE
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    } else {
      //programming or other unknown error:don't leak the err details
      console.error('Error', err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please Try Again',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleTokenExpireError();

    sendErrorProd(error, req, res);
  }
};
