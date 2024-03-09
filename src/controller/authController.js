const authService = require('../service/authService')

const authController = {
    login: (req, res) => {
        return authService.svLogin(req, res)
    },
    register: (req, res) => {
        return authService.svRegister(req, res)
    },
    verifyCode: (req, res) => {
        return authService.svVerifyCode(req, res)
    },
    forgotPassword: (req, res) => {
        return authService.svForgotPassword(req, res)
    },
    refreshToken: (req, res) => {
        return authService.svRefreshToken(req, res)
    }
}

module.exports = authController;