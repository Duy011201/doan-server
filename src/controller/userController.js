const userService = require('../service/userService');

const userController = {
  create: (req, res) => {
    return userService.svCreate(req, res);
  },
  update: (req, res) => {
    return userService.svUpdate(req, res);
  },
  getAll: (req, res) => {
    return userService.svGetAll(req, res);
  },
  delete: (req, res) => {
    return userService.svDelete(req, res);
  },
};

module.exports = userController;
