const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify-code', authController.verifyCode);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
