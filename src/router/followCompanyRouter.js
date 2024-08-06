const express = require('express');
const router = express.Router();
const followCompanyController = require('../controller/followCompanyController');

router.post('/create', followCompanyController.create);
router.post('/delete', followCompanyController.delete);
router.post('/get-all', followCompanyController.getAll);

module.exports = router;