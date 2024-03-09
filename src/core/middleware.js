const jwt = require('jsonwebtoken');
const setting = require('../config/setting');
const HttpException = require('../core/http-exception');
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
        return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.Unauthorized, setting.SYSTEM_STATUS_MESSAGE.Unauthorized, {}));
    }

    try {
        req.user = verifyToken(token);
        req.body.token = token;
        next();
    } catch (err) {
        return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_TOKEN, {}));
    }
}

module.exports = {middlewareAuth};
