const express = require('express');
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');

const router = express.Router();

router.use(authController.protect);
router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession,
);

router.use(authController.restrictTo('admin', 'lead-guide'));
router
  .route('/')
  .get(bookingController.getallbookings)
  .post(bookingController.createbooking);
router
  .route('/:id')
  .get(bookingController.getbooking)
  .patch(bookingController.updatebooking)
  .delete(bookingController.deletebooking);
module.exports = router;
