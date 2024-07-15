const historyService = require('../service/historyService');

const historyController = {
  getAll: (req, res) => {
    return historyService.svGetAll(req, res);
  },
};

module.exports = historyController;
