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
// tours-within/233/center/34.111745,-118.113491/unit/mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.gettourswithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
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
    tourController.uploadTourimages,
    tourController.resizeTourimages,
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
