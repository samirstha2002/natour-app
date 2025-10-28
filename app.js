const express = require('express');

const morgan = require('morgan');
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
// starting  server
module.exports = app;
