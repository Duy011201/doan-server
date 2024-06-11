const roleService = require('../service/roleService');

const roleController = {
  getAll: (req, res) => {
    return roleService.svGetAll(req, res);
  },
};

module.exports = roleController;
