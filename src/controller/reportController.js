const reportService = require('../service/reportService');

const reportController = {
  employer: (req, res) => {
    return reportService.svEmployer(req, res);
  },
  admin: (req, res) => {
    return reportService.svAdmin(req, res);
  },
};

module.exports = reportController;
