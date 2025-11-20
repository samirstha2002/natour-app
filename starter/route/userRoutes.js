const express = require('express');

const authController = require('./../controller/authController');
const userController = require('./../controller/usercontoller');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
// all routes pri=otected after this middle ware
router.use(authController.protect);
router.patch(
  '/updatePassword',

  authController.updatePassword,
);
router.get(
  '/me',

  userController.getme,
  userController.getuser,
);
router.patch(
  '/updateMe',

  userController.uploadUserPhoto,
  userController.resizePhoto,
  userController.updateMe,
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.use(authController.restrictTo('admin'));
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
