const express = require('express');
const reviewcontroller = require('./../controller/reviewcontroller');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewcontroller.getallreviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewcontroller.settouruserIds,
    reviewcontroller.createreview,
  );
router
  .route('/:id')
  .get(reviewcontroller.getreview)
  .patch(reviewcontroller.updatereviews)
  .delete(reviewcontroller.deletereviews);
module.exports = router;
