const notificationService = require('../service/notificationService');

const notificationController = {
    info: (req, res) => {
        return notificationService.svInfo(req, res);
    },
};

module.exports = notificationController;
