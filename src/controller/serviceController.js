const servicePack = require('../service/servicePackService');

const servicePackController = {
  create: (req, res) => {
    return servicePack.svCreate(req, res);
  },
  update: (req, res) => {
    return servicePack.svUpdate(req, res);
  },
  getAll: (req, res) => {
    return servicePack.svGetAll(req, res);
  },
  delete: (req, res) => {
    return servicePack.svDelete(req, res);
  },
};

module.exports = servicePackController;
