const express = require('express');
const router = express.Router();
const recruitmentProcessController = require('../controller/recruitmentProcessController');

router.post('/create', recruitmentProcessController.create);
router.post('/delete', recruitmentProcessController.delete);
router.post('/get-all-employer', recruitmentProcessController.getAllEmployer);
router.post('/get-all-candidate', recruitmentProcessController.getAllCandidate);
router.post('/save-profile', recruitmentProcessController.saveProfile);

module.exports = router;