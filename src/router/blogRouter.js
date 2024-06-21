const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');

router.post('/create', blogController.create);
router.post('/update', blogController.update);
router.post('/delete', blogController.delete);
router.post('/get-all', blogController.getAll);
router.post('/status', blogController.status);

module.exports = router;
