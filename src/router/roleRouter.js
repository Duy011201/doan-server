const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');

router.post('/get-all', roleController.getAll);

module.exports = router;
