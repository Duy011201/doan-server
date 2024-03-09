const setting = require('../config/setting');
const {querySQl, performSQL} = require('../core/repository');
const HttpException = require('../core/http-exception');
const {
    isEmpty,
    isEmail,
    bcryptComparePassword,
    bcryptHashPassword,
    generateRandomVerifyCode,
    timeDiff,
    filterFields
} = require('../core/func');
const {refreshToken, generateToken} = require('../core/jsonwebtoken');
const {sendEmail} = require('../core/nodemailer');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

const authService = {
    svLogin: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        // Validate
        if (isEmpty(password)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.BadRequest));
        if (isEmail(email)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT));

        try {
            let usersDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.USER, [{_email: email}]);
            switch (true) {
                case (usersDB && usersDB.length > 1):
                    return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.ERROR_EXIT_ANY_ACCOUNT));
                case (isEmpty(usersDB) || !await bcryptComparePassword(password, usersDB[0][`_password`])):
                    return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD));
                case (usersDB[0][`_status`] !== setting.SYSTEM_STATUS.ACTIVE):
                    return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT));
            }

            let roles = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.ROLE, [{_userID: usersDB[0][`_userID`]}]);
            usersDB = filterFields(usersDB, ['_userID', '_email', '_status']);
            usersDB[0]['_roles'] = isEmpty(roles) ? [] : filterFields(roles, ['_name']);
            usersDB[0]['_token'] = generateToken(usersDB[0]);

            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_LOGIN_ACCOUNT, usersDB[0]));
        } catch (err) {
            console.error('Error executing query login :', err.stack);
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.InternalServerError));
        }
    },
    svRegister: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const verifyCode = req.body.verifyCode;
        const createdBy = 'system';
        const updatedBy = 'system';
        const userID = uuidv4();
        const today = new Date();

        // Validate
        if (isEmpty(verifyCode) || isEmpty(password)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.BadRequest));
        if (isEmail(email)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT));

        try {
            let users = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.USER, [{_email: email}]);
            if (!isEmpty(users)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT));

            const verifyCodeDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.VERIFY_CODE, [{_email: email}]);
            // Default one day
            if (!isEmpty(verifyCodeDB) && timeDiff(today, verifyCodeDB[0]['_createdAt'], 1) && verifyCodeDB[0]['_code'] === verifyCode) {
                let hashPassword = await bcryptHashPassword(password);
                await querySQl(`INSERT INTO ${setting.TABLE_DATABASE.USER} (_userID, _email, _password, _status, _createdBy, _updatedBy)
                             VALUES (?, ?, ?, ?, ?, ?)`, [userID, email, hashPassword, setting.SYSTEM_STATUS.ACTIVE, createdBy, updatedBy])
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_REGISTER_ACCOUNT, {userID: userID}));
            }

            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_REGISTER_ACCOUNT, {}));
        } catch (err) {
            console.error('Error executing query register :', err.stack);
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.InternalServerError, {}));
        }
    },
    svVerifyCode: async (req, res) => {
        const verifyCode = generateRandomVerifyCode();
        const verifyCodeID = uuidv4();
        const email = req.body.email;
        const createdBy = 'system';
        const updatedBy = 'system';

        // Validate
        if (isEmpty(email)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT, {}));

        try {
            const verifyCodeDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.VERIFY_CODE, [{_email: email}]);
            if (isEmpty(verifyCodeDB)) {
                await performSQL(setting.SQL_METHOD.INSERT, setting.TABLE_DATABASE.VERIFY_CODE,
                    [{_verifyCodeID : verifyCodeID}, {_code: verifyCode}, {_email: email}, {_createdBy: createdBy}, {_updatedBy: updatedBy}])
            }

            await performSQL(setting.SQL_METHOD.UPDATE, setting.TABLE_DATABASE.VERIFY_CODE, [{_code: verifyCode},
                {_email: email}, {_createdBy: createdBy}, {_updatedBy: updatedBy},{_verifyCodeID : verifyCodeDB[0]['_verifyCodeID']}]);

            await sendEmail(process.env.SERVER_EMAIL_ADDRESS_TEST, process.env.SERVER_NAME, `Mã xác thực của bạn là: ${verifyCode}`)
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_SEND_VERIFY_CODE, {verifyCode: `${verifyCode}`}));
        } catch (err) {
            console.error('Error executing query verify code :', err.stack);
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.InternalServerError, {}));
        }
    },
    svForgotPassword: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const verifyCode = req.body.verifyCode;
        const today = new Date();

        // Validate
        if (isEmpty(verifyCode) || isEmpty(password)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.BadRequest, {}));
        if (isEmail(email)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT, {}));

        try {
            let userDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.USER, [{_email: email}]);
            if (isEmpty(userDB)) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT, {}));
            if (!isEmpty(userDB) && userDB[0][`_status`] !== setting.SYSTEM_STATUS.ACTIVE) return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT, {}));

            const verifyCodeDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.VERIFY_CODE, [{_email: email}]);

            // Default update one day
            if (!isEmpty(verifyCodeDB) && timeDiff(today, verifyCodeDB[0]['_updatedAt'], 1) && verifyCodeDB[0]['_code'] === verifyCode) {
                let hashPassword = await bcryptHashPassword(password);
                await performSQL(setting.SQL_METHOD.UPDATE, setting.TABLE_DATABASE.USER, [{_password: hashPassword},
                    {_updatedBy: userDB[0]['_userID']}, {_userID : userDB[0]['_userID']}]);

                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_FORGOT_PASSWORD, {}));
            }

            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_FORGOT_PASSWORD, {}));
        } catch (err) {
            console.error('Error executing query forgot password :', err.stack);
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.InternalServerError, {}));
        }
    },
    svRefreshToken: async (req, res) => {
        return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.SYSTEM_STATUS_MESSAGE.SUCCESS_REFRESH_TOKEN, {token: refreshToken(req.body.token)}));
    }
}

module.exports = authService;