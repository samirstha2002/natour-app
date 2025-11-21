const path = require('path');
// const pug = require('pug');
const express = require('express');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// xss ko baki xa paxi grumla

const morgan = require('morgan');
const globalerrorHandler = require('./starter/controller/errorcontroller');
const AppError = require('./starter/utils/appError');
const tourRouter = require('./starter/route/tourRoutes');
const userRouter = require('./starter/route/userRoutes');
const reviewrouter = require('./starter/route/reviewroute');
const viewRouter = require('./starter/route/viewRoutes');
const bookingrouter = require('./starter/route/bookingroutes');
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'starter', 'views'));
// 1)  Global MiddleWare
//serving staticfiles
app.use(express.static(path.join(__dirname, 'starter', 'public')));

//set the security http  headers

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", 'https://unpkg.com', "'unsafe-inline'"], // allow MapLibre scripts
//       styleSrc: ["'self'", 'https://unpkg.com', "'unsafe-inline'"], // allow MapLibre CSS
//       imgSrc: ["'self'", 'data:'],
//       connectSrc: ["'self'"],
//       workerSrc: ["'self'", 'blob:'],
//     },
//   }),
// );

console.log(process.env.NODE_ENV);
// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit the requests from same api

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from the Ip, please try again in an hour',
});

app.use('/api', limiter);
// body parser ,reading the data from req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// data sanitization against NosqlInjection
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  // skip req.query to avoid read-only error in Express 5
  next();
});

app.use(hpp());

// test middlewares
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// routes
// const tourRouter = express.Router();
// const userRouter = express.Router();
app.use('/', viewRouter);
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/reviews/', reviewrouter);
app.use('/api/v1/bookings/', bookingrouter);

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
