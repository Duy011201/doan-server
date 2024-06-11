const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/create', userController.create);
router.post('/update', userController.update);
router.post('/delete', userController.delete);
router.post('/get-all', userController.getAll);
router.post('/reset-password', userController.resetPassword);
router.post('/lock', userController.lock);

module.exports = router;
