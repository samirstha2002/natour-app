const express = require('express');

const morgan = require('morgan');
const globalerrorHandler = require('./starter/controller/errorcontroller');
const AppError = require('./starter/utils/appError');
const tourRouter = require('./starter/route/tourRoutes');
const userRouter = require('./starter/route/userRoutes');
const app = express();
// 1) MiddleWare
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/starter/public`)); //midleware

app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// routes
// const tourRouter = express.Router();
// const userRouter = express.Router();

app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

// ✅ Catch-all 404 handler for Express 5
app.use((req, res, next) => {
  // const err = new Error(`Cannot find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalerrorHandler);

// starting  server
module.exports = app;
