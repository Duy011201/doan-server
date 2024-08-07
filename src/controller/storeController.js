const storeService = require('../service/storeService');

const roleController = {
  upload: (req, res) => {
    return storeService.svUpload(req, res);
  },
  getFile: (req, res) => {
    return storeService.svGetFile(req, res);
  },
  getManyFile: (req, res) => {
    return storeService.svGetManyFile(req, res);
  },
};

module.exports = roleController;
