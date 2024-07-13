const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');

router.post('/create', serviceController.create);
router.post('/update', serviceController.update);
router.post('/delete', serviceController.delete);
router.post('/get-all', serviceController.getAll);

module.exports = router;
