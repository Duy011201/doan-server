const express = require('express');
const router = express.Router();
const storeController = require('../controller/storeController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.array('files'), storeController.upload);
router.get('/files/:filename', storeController.getFile);

module.exports = router;
