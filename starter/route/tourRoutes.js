const express = require('express');
const tourController = require('./../controller/tourcontroller');
const router = express.Router();

// router.param('id', tourController.checkId);
router
  .route('/top5tour')
  .get(tourController.aliastop, tourController.getalltours);
router
  .route('/')
  .get(tourController.getalltours)
  .post(tourController.createtour);
router
  .route('/:id')
  .get(tourController.gettours)
  .patch(tourController.updatetour)
  .delete(tourController.deletetour);

module.exports = router;
