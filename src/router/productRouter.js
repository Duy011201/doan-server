const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.post('/create', productController.create);
router.post('/update', productController.update);
router.post('/delete', productController.delete);
router.post('/get-all', productController.getAll);

module.exports = router;
