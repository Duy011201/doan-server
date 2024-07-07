const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');

router.post('/send-content-email', notificationController.sendContentEmail);

module.exports = router;
