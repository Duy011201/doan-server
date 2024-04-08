const setting = require('../config/setting');
const {verifyToken} = require('./jsonwebtoken');

require('dotenv').config();

function middlewareAuth(req, res, next) {
    // auth
    if (req.url.includes("/auth")) {
        return next();
    }

    let token = undefined;
    if (req.headers && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.body && req.body.token) {
        token = req.body.token;
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(setting.SYSTEM_STATUS_CODE.UNAUTHORIZED).json({message:  setting.SYSTEM_STATUS_MESSAGE.UNAUTHORIZED});
    }

    try {
        req.user = verifyToken(token);
        req.body.token = token;
        next();
    } catch (err) {
        res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message:  setting.SYSTEM_STATUS_MESSAGE.INVALID_TOKEN});
    }
}

module.exports = {middlewareAuth};
