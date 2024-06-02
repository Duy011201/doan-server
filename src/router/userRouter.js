const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/crate', userController.create);
router.post('/update', userController.update);
router.post('/delete', userController.delete);
router.post('/get-all', userController.getAll);

module.exports = router;
