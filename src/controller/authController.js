const userService = require('../service/authService')

const authController = {
    create: (req, res) => {
        return authService.svLogin(req, res)
    },
    register: (req, res) => {
        return authService.svRegister(req, res)
    },
    verifyCode: (req, res) => {
        return authService.svVerifyCode(req, res)
    },
}

module.exports = authController;