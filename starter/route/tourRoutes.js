const express = require('express');
const tourController = require('./../controller/tourcontroller');

const authController = require('./../controller/authController');
// const reviewcontroller = require('./../controller/reviewcontroller');
const reviewRouter = require('./../route/reviewroute');

const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top5tour')
  .get(tourController.aliastop, tourController.getalltours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );
router
  .route('/')
  .get(tourController.getalltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createtour,
  );
router
  .route('/:id')
  .get(tourController.gettours)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updatetour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deletetour,
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewcontroller.createreview,
//   );
module.exports = router;
