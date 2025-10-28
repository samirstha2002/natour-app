const express = require('express');
const tourController = require('./../controller/tourcontroller');
const router = express.Router();

// router.param('id', tourController.checkId);

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
