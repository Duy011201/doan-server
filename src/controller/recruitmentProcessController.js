const recruitmentProcessService = require('../service/recruitmentProcessService');

const recruitmentProcessController = {
    create: (req, res) => {
        return recruitmentProcessService.svCreate(req, res);
    },
    getAllEmployer: (req, res) => {
        return recruitmentProcessService.svGetAllEmployer(req, res);
    },
    getAllCandidate: (req, res) => {
        return recruitmentProcessService.svGetAllCandidate(req, res);
    },
    delete: (req, res) => {
        return recruitmentProcessService.svDelete(req, res);
    },
};

module.exports = recruitmentProcessController;
