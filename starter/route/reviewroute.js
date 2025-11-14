const express = require('express');
const reviewcontroller = require('./../controller/reviewcontroller');
const authController = require('./../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(reviewcontroller.getallreviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewcontroller.createreview,
  );

module.exports = router;
