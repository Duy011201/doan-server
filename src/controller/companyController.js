const companyService = require('../service/companyService');

const companyController = {
  create: (req, res) => {
    return companyService.svCreate(req, res);
  },
  update: (req, res) => {
    return companyService.svUpdate(req, res);
  },
  getAll: (req, res) => {
    return companyService.svGetAll(req, res);
  },
  getByID: (req, res) => {
    return companyService.svGetByID(req, res);
  },
  getAllHeader: (req, res) => {
    return companyService.svGetAllHeader(req, res);
  },
  delete: (req, res) => {
    return companyService.svDelete(req, res);
  },
  lock: (req, res) => {
    return companyService.svLock(req, res);
  },
};

module.exports = companyController;
