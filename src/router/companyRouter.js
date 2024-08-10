const express = require('express');
const router = express.Router();
const companyController = require('../controller/companyController');

router.post('/create', companyController.create);
router.post('/update', companyController.update);
router.post('/delete', companyController.delete);
router.post('/get-all', companyController.getAll);
router.post('/get-by-id', companyController.getByID);
router.post('/get-all-header', companyController.getAllHeader);
router.post('/follow', companyController.follow);
router.post('/lock', companyController.lock);

module.exports = router;
