const express = require('express');
const authController = require('./../controller/authController');
const userController = require('./../controller/usercontoller');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
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
