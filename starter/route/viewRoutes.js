const express = require('express');
const viewController = require('./../controller/viewController');
const authController = require('./../controller/authController');
const router = express.Router();

router.get('/', authController.isloggedIn, viewController.getOverview);

router.get('/tour/:slug', authController.isloggedIn, viewController.getTour);

router.get('/login', authController.isloggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);

module.exports = router;
