const reportService = require('../service/reportService');

const reportController = {
  employer: (req, res) => {
    return reportService.svEmployer(req, res);
  },
};

module.exports = reportController;
