const setting = require('../config/setting');
const {querySQl, performSQL} = require('../core/repository');
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
        const email = req.body.email || undefined;
        const password = req.body.password || undefined;

        if (!isEmail(email)) {
            return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT});
        }
        if (isEmpty(password)) {
            return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.INVALID_PASSWORD_FORMAT});
        }

        try {
            let usersDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.USER, [{_email: email}]);
            switch (true) {
                case (usersDB && usersDB.length > 1):
                    return res.status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR).json({message: setting.RESPONSE_MESSAGE.ERROR_EXIT_ANY_ACCOUNT});
                case (isEmpty(usersDB) || !await bcryptComparePassword(password, usersDB[0][`_password`])):
                    return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD});
                case (usersDB[0][`_status`] !== setting.SYSTEM_STATUS.ACTIVE):
                    return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT});
            }

            let roles = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.ROLE, [{_userID: usersDB[0][`_userID`]}]);
            if (isEmpty(roles)) {
                return res.status(setting.SYSTEM_STATUS_CODE.UNAUTHORIZED).json({message: setting.RESPONSE_MESSAGE.ERROR_ROLE});
            }

            usersDB = filterFields(usersDB, ['_userID', '_email', '_status']);
            usersDB[0]['_roles'] = filterFields(roles, ['_name']);
            usersDB[0]['_token'] = generateToken(usersDB[0]);

            return res.status(setting.SYSTEM_STATUS_CODE.OK).json({
                message: setting.RESPONSE_MESSAGE.SUCCESS_LOGIN_ACCOUNT,
                data: usersDB[0]
            });
        } catch (err) {
            console.error('Error executing query login :', err.stack);
            return res.status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR).json({message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },
    svRegister: async (req, res) => {
        const {email, password, verifyCode, role, desc} = req.body;
        const createdBy = 'system';
        const updatedBy = 'system';
        const userID = uuidv4();
        const roleID = uuidv4();
        const today = new Date();

        // Validate request parameters
        if (isEmpty(verifyCode) || isEmpty(password) || !isEmail(email)) {
            return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.SYSTEM_STATUS_MESSAGE.BAD_REQUEST});
        }

        try {
            let users = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.USER, [{_email: email}]);

            if (!isEmpty(users)) {
                return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT});
            }

            const verifyCodeDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.VERIFY_CODE, [{_email: email}]);

            // Default one day
            if (isEmpty(verifyCodeDB) || verifyCodeDB[0]['_status'] !== setting.SYSTEM_STATUS.ACTIVE
                || timeDiff(today, verifyCodeDB[0]['_updatedAt'], 1) && verifyCodeDB[0]['_code'] !== verifyCode) {
                return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.INVALID_ENCRYPTION_AUTHENTICATION});
            }

            if (!isEmpty(role) && !isEmpty(desc)) {
                let hashPassword = await bcryptHashPassword(password);

                await querySQl(`INSERT INTO ${setting.TABLE_DATABASE.USER} (_userID, _email, _password, _status, _createdBy, _updatedBy)
                                VALUES (?, ?, ?, ?, ?,
                                        ?)`, [userID, email, hashPassword, setting.SYSTEM_STATUS.ACTIVE, createdBy, updatedBy]);

                await querySQl(`INSERT INTO ${setting.TABLE_DATABASE.ROLE} (_roleID, _userID, _ name, _ desc, _createdBy, _updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?)`, [roleID, userID, role, desc, createdBy, updatedBy]);

                await performSQL(setting.SQL_METHOD.UPDATE, setting.TABLE_DATABASE.VERIFY_CODE,
                    [{_status: setting.SYSTEM_STATUS.IN_ACTIVE}, {_verifyCodeID: verifyCodeDB[0]['_verifyCodeID']}]);

                return res.status(setting.SYSTEM_STATUS_CODE.OK).json({
                    message: setting.RESPONSE_MESSAGE.SUCCESS_REGISTER_ACCOUNT,
                    data: {userID: userID}
                });
            }

            return res.status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR).json({message: setting.RESPONSE_MESSAGE.ERROR_REGISTER_ACCOUNT});
        } catch (err) {
            console.error('Error executing query register :', err.stack);
            return res.status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR).json({message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },
    svVerifyCode: async (req, res) => {
        const verifyCode = generateRandomVerifyCode();
        const verifyCodeID = uuidv4();
        const email = req.body.email;
        const createdBy = 'system';
        const updatedBy = 'system';
        const status = setting.SYSTEM_STATUS.ACTIVE;

        // Validate email
        if (!isEmail(email)) {
            return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.SYSTEM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT});
        }

        try {
            const verifyCodeDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.VERIFY_CODE, [{_email: email}]);

            if (isEmpty(verifyCodeDB)) {
                await querySQl(`INSERT INTO ${setting.TABLE_DATABASE.VERIFY_CODE} (_verifyCodeID, _code, _email, _status, _createdBy, _updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?)`, [verifyCodeID, verifyCode, email, status, createdBy, updatedBy]);
            } else {
                await performSQL(setting.SQL_METHOD.UPDATE, setting.TABLE_DATABASE.VERIFY_CODE, [{_code: verifyCode}, {_status: setting.SYSTEM_STATUS.ACTIVE},
                    {_email: email}, {_createdBy: createdBy}, {_updatedBy: updatedBy}, {_verifyCodeID: verifyCodeDB[0]['_verifyCodeID']}]);
            }

            await sendEmail(process.env.SERVER_EMAIL_ADDRESS_TEST, process.env.SERVER_NAME, `Mã xác thực của bạn là: ${verifyCode}`);
            return res.status(setting.SYSTEM_STATUS_CODE.OK).json({message: setting.RESPONSE_MESSAGE.SUCCESS_SEND_VERIFY_CODE});
        } catch (err) {
            console.error('Error executing query verify code :', err.stack);
            return res.status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR).json({message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svForgotPassword: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const verifyCode = req.body.verifyCode;
        const today = new Date();

        // Validate email and verifyCode
        if (isEmpty(verifyCode) || isEmpty(password)) {
            return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.SYSTEM_STATUS_MESSAGE.BAD_REQUEST});
        }
        if (!isEmail(email)) {
            return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.SYSTEM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT});
        }

        try {
            let userDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.USER, [{_email: email}]);
            if (isEmpty(userDB)) {
                return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT});
            }
            if (userDB[0]['_status'] !== setting.SYSTEM_STATUS.ACTIVE) {
                return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT});
            }

            const verifyCodeDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.VERIFY_CODE, [{_email: email}]);

            // Default one day
            if (isEmpty(verifyCodeDB) || verifyCodeDB[0]['_status'] !== setting.SYSTEM_STATUS.ACTIVE
                || timeDiff(today, verifyCodeDB[0]['_updatedAt'], 1) && verifyCodeDB[0]['_code'] !== verifyCode) {
                return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.INVALID_ENCRYPTION_AUTHENTICATION});
            }

            let hashPassword = await bcryptHashPassword(password);
            await performSQL(setting.SQL_METHOD.UPDATE, setting.TABLE_DATABASE.USER, [{_password: hashPassword},
                {_updatedBy: userDB[0]['_userID']}, {_userID: userDB[0]['_userID']}]);

            await performSQL(setting.SQL_METHOD.UPDATE, setting.TABLE_DATABASE.VERIFY_CODE,
                [{_status: setting.SYSTEM_STATUS.IN_ACTIVE}, {_verifyCodeID: verifyCodeDB[0]['_verifyCodeID']}]);

            return res.status(setting.SYSTEM_STATUS_CODE.OK).json({message: setting.RESPONSE_MESSAGE.SUCCESS_FORGOT_PASSWORD});

        } catch (err) {
            console.error('Error executing query forgot password :', err.stack);
            return res.status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR).json({message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svRefreshToken: async (req, res) => {
        let token = undefined;
        if (req.headers && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.body && req.body.token) {
            token = req.body.token;
        } else if (req.query && req.query.token) {
            token = req.query.token;
        }

        try {
            return res.status(setting.SYSTEM_STATUS_CODE.OK).json({
                message: setting.SYSTEM_STATUS_MESSAGE.SUCCESS_REFRESH_TOKEN,
                token: refreshToken(token)
            });
        } catch (error) {
            return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({message: setting.RESPONSE_MESSAGE.INVALID_TOKEN});
        }
    },
}

module.exports = authService;