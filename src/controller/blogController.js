const blogService = require('../service/blogService');

const blogController = {
    create: (req, res) => {
        return blogService.svCreate(req, res);
    },
    update: (req, res) => {
        return blogService.svUpdate(req, res);
    },
    getAll: (req, res) => {
        return blogService.svGetAll(req, res);
    },
    delete: (req, res) => {
        return blogService.svDelete(req, res);
    },
    status: (req, res) => {
        return blogService.svStatus(req, res);
    },
};

module.exports = blogController;
