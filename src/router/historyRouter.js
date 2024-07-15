const express = require('express');
const router = express.Router();
const historyController = require('../controller/historyController');

router.post('/get-all', historyController.getAll);

module.exports = router;
