const express = require('express');
const reviewcontroller = require('./../controller/reviewcontroller');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route('/')
  .get(reviewcontroller.getallreviews)
  .post(
    authController.restrictTo('user'),
    reviewcontroller.settouruserIds,
    reviewcontroller.createreview,
  );
router
  .route('/:id')
  .get(reviewcontroller.getreview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewcontroller.updatereviews,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewcontroller.deletereviews,
  );
module.exports = router;
