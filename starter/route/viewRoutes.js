const express = require('express');
const viewController = require('./../controller/viewController');
const authController = require('./../controller/authController');
const router = express.Router();
const bookingController = require('./../controller/bookingController');
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isloggedIn,
  viewController.getOverview,
);

router.get('/tour/:slug', authController.isloggedIn, viewController.getTour);
router.get('/signup', authController.isloggedIn, viewController.getSignupForm);
router.get('/login', authController.isloggedIn, viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
