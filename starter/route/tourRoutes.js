const express = require('express');
const tourController = require('./../controller/tourcontroller');
const router = express.Router();
const authController = require('./../controller/authController');
// router.param('id', tourController.checkId);
router
  .route('/top5tour')
  .get(tourController.aliastop, tourController.getalltours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(authController.protect, tourController.getalltours)
  .post(tourController.createtour);
router
  .route('/:id')
  .get(tourController.gettours)
  .patch(tourController.updatetour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deletetour,
  );

module.exports = router;
