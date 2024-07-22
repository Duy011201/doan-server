const recruitmentService = require('../service/recruitmentService');

const recruitmentController = {
  create: (req, res) => {
    return recruitmentService.svCreate(req, res);
  },
  update: (req, res) => {
    return recruitmentService.svUpdate(req, res);
  },
  status: (req, res) => {
    return recruitmentService.svStatus(req, res);
  },
  getAll: (req, res) => {
    return recruitmentService.svGetAll(req, res);
  },
  delete: (req, res) => {
    return recruitmentService.svDelete(req, res);
  },
};

module.exports = recruitmentController;
