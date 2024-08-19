const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportController');

router.post('/get-employer', reportController.employer);
router.post('/get-admin', reportController.admin);

module.exports = router;