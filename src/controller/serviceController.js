const service = require('../service/serviceService');

const userController = {
  create: (req, res) => {
    return service.svCreate(req, res);
  },
  update: (req, res) => {
    return service.svUpdate(req, res);
  },
  getAll: (req, res) => {
    return service.svGetAll(req, res);
  },
  delete: (req, res) => {
    return service.svDelete(req, res);
  },
};

module.exports = userController;
