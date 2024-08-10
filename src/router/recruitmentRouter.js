const express = require('express');
const router = express.Router();
const recruitmentController = require('../controller/recruitmentController');

router.post('/create', recruitmentController.create);
router.post('/update', recruitmentController.update);
router.post('/status', recruitmentController.status);
router.post('/delete', recruitmentController.delete);
router.post('/get-all', recruitmentController.getAll);
router.post('/get-all-header', recruitmentController.getAllHeader);

module.exports = router;
