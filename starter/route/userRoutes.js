const express = require('express');
const authController = require('./../controller/authController');
const userController = require('./../controller/usercontoller');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router

  .route('/')
  .get(userController.getallusers)
  .post(userController.createuser);
router
  .route('/:id')
  .get(userController.getuser)
  .patch(userController.updateuser)
  .delete(userController.deleteuser);

module.exports = router;
