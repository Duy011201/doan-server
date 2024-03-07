const setting = require('../config/setting');
const {query} = require('../core/repository');
const HttpException = require('../core/http-exception');
const {isEmpty, isEmail, bcryptComparePassword, bcryptHashPassword, generateRandomVerifyCode, timeDiff} = require('../core/func');
const {sendEmail} = require('../core/nodemailer');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

const authService = {
    svLogin: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        // Validate
        if (isEmpty(password)) {
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.BadRequest, {}));
        }
        if (isEmail(email)) {
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT, {}));
        }

        try {
            const result = await query(`SELECT *
                                        FROM ${setting.TABLE_DATABASE.USER} as user
                                        WHERE user._email = ?`, [email])

            if (!isEmpty(result) && result[0][`_status`] !== setting.SYSTEM_STATUS.ACTIVE) {
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT, {}));
            }

            if (!isEmpty(result) && result[0][`_status`] === setting.SYSTEM_STATUS.ACTIVE && await bcryptComparePassword(password, result[0][`_password`])) {
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_LOGIN_ACCOUNT, {}));
            }

            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD, {}));
        } catch (err) {
            console.error('Error executing query login :', err.stack);
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.InternalServerError, {}));
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
        if (isEmpty(verifyCode) || isEmpty(password)) {
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.BadRequest, {}));
        }
        if (isEmail(email)) {
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT, {}));
        }

        try {
            const userDB = await query(`SELECT *
                                          FROM ${setting.TABLE_DATABASE.USER} as user
                                          WHERE user._email = ?`, [email])
            if (!isEmpty(userDB)) {
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT, {}));
            }

            const verifyCodeDB = await query(`SELECT *
                                        FROM ${setting.TABLE_DATABASE.VERIFY_CODE} as verify_code
                                        WHERE verify_code._email = ?`, [email])

            // Default one day
            if (!isEmpty(verifyCodeDB) && timeDiff(today, verifyCodeDB[0]['_createdAt'], 1) && verifyCodeDB[0]['_code'] === verifyCode) {
                let hashPassword = await bcryptHashPassword(password);
                await query(`INSERT INTO ${setting.TABLE_DATABASE.USER} (_userID, _email, _password, _status, _createdBy, _updatedBy)
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
        if (isEmpty(email)) {
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT, {}));
        }

        try {
            const result = await query(`SELECT *
                                        FROM ${setting.TABLE_DATABASE.VERIFY_CODE} as verify_code
                                        WHERE verify_code._email = ?`, [email])

            if (isEmpty(result)) {
                await query(`INSERT INTO ${setting.TABLE_DATABASE.VERIFY_CODE} (_verifyCodeID, _code, _email, _createdBy, _updatedBy)
                             VALUES (?, ?, ?, ?, ?)`, [verifyCodeID, verifyCode, email, createdBy, updatedBy]);
                await sendEmail(process.env.SERVER_EMAIL_ADDRESS_TEST, process.env.SERVER_NAME, `Mã xác thực của bạn là: ${verifyCode}`);
                // await sendEmail(email, process.env.SERVER_NAME, `Mã xác thực của bạn là: ${verifyCode}`);
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT, {}));
            }

            await query(`UPDATE ${setting.TABLE_DATABASE.VERIFY_CODE}
                         SET _code = ?, _email = ?, _createdBy = ?, _updatedBy = ?
                         WHERE _verifyCodeID = ?`, [verifyCode, email, createdBy, updatedBy, result[0]['_verifyCodeID']]);

            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_SEND_VERIFY_CODE, {verifyCode : `${verifyCode}`}));
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
        if (isEmpty(verifyCode) || isEmpty(password)) {
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.BadRequest, {}));
        }
        if (isEmail(email)) {
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT, {}));
        }

        try {
            const userDB = await query(`SELECT *
                                          FROM ${setting.TABLE_DATABASE.USER} as user
                                          WHERE user._email = ?`, [email])

            if (!isEmpty(userDB) && userDB[0][`_status`] !== setting.SYSTEM_STATUS.ACTIVE) {
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT, {}));
            }

            if (isEmpty(userDB)) {
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT, {}));
            }

            const verifyCodeDB = await query(`SELECT *
                                        FROM ${setting.TABLE_DATABASE.VERIFY_CODE} as verify_code
                                        WHERE verify_code._email = ?`, [email])

            // Default one day
            if (!isEmpty(verifyCodeDB) && timeDiff(today, verifyCodeDB[0]['_createdAt'], 1) && verifyCodeDB[0]['_code'] === verifyCode) {
                let hashPassword = await bcryptHashPassword(password);
                await query(`UPDATE ${setting.TABLE_DATABASE.USER}
                             SET _password = ?, _updatedBy = ?
                             WHERE _userID = ?`, [hashPassword, userDB[0]['_userID'], userDB[0]['_userID']]);
                return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_FORGOT_PASSWORD, {}));
            }

            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_FORGOT_PASSWORD, {}));
        } catch (err) {
            console.error('Error executing query forgot password :', err.stack);
            return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.InternalServerError, {}));
        }
    }
}

module.exports = authService;