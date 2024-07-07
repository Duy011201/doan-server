const notificationService = require('../service/notificationService');

const notificationController = {
    sendContentEmail: (req, res) => {
        return notificationService.svSendContentEmail(req, res);
    },
};

module.exports = notificationController;
