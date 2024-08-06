const followCompanyService = require('../service/followCompanyService');

const followCompanyController = {
    create: (req, res) => {
        return followCompanyService.svCreate(req, res);
    },
    getAll: (req, res) => {
        return followCompanyService.svGetAll(req, res);
    },
    delete: (req, res) => {
        return followCompanyService.svDelete(req, res);
    },
};

module.exports = followCompanyController;
