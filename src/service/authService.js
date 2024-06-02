const setting = require('../config/setting');
const {querySQl} = require('../core/repository');

const {
    isEmpty,
    isEmail,
    bcryptComparePassword,
    bcryptHashPassword,
    generateRandomVerifyCode,
    timeDiff,
    filterFields,
    findKeyInObject
} = require('../core/func');
const {refreshToken, generateToken} = require('../core/jsonwebtoken');
const {sendEmail} = require('../core/nodemailer');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

const authService = {
    /*
    * TODO svLogin
    * input email, password
    * check email, status, password, role
    * output data user
     */
    svLogin: async (req, res) => {
        const payload = req.body;

        if (isEmpty(payload.password))
            return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.BadRequest,
                    massage: setting.SYSTEM_STATUS_MESSAGE.BadRequest
                });
        if (!isEmail(payload.email))
            return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.BadRequest,
                    massage: setting.SYSTEM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT
                });

        try {
            let usersDB = await querySQl(`SELECT *
                                          FROM ${setting.TABLE_DATABASE.USER} as u
                                          WHERE u.email = ?`, [payload.email]);
            switch (true) {
                case (isEmpty(usersDB) || !await bcryptComparePassword(payload.password, usersDB[0][`password`])):
                    return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                        .json({
                            status: setting.SYSTEM_STATUS_CODE.BadRequest,
                            message: setting.RESPONSE_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD
                        });
                case (usersDB[0][`status`] !== setting.SYSTEM_STATUS.ACTIVE):
                    return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                        .json({
                            status: setting.SYSTEM_STATUS_CODE.BadRequest,
                            message: setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT
                        });
            }

            let roles = await querySQl(`SELECT *
                                        FROM ${setting.TABLE_DATABASE.ROLE} as r
                                        WHERE r.userID = ?`, [usersDB[0]['userID']]);
            usersDB = filterFields(usersDB, ['userID', 'email', 'status']);

            // assign role, token
            usersDB[0]['roles'] = isEmpty(roles) ? [] : filterFields(roles, ['name']);
            usersDB[0]['token'] = generateToken(usersDB[0]);

            return res.status(setting.SYSTEM_STATUS_CODE.OK)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.OK, message: setting.RESPONSE_MESSAGE.SUCCESS_LOGIN_ACCOUNT
                    , data: usersDB[0]
                });
        } catch (err) {
            console.error('Error executing query login :', err.stack);
            return res.status(setting.SYSTEM_STATUS_CODE.InternalServerError)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.InternalServerError,
                    message: setting.SYSTEM_STATUS_MESSAGE.InternalServerError
                });
        }
    },
    /*
    * TODO svRegister
    * input email, password, verifyCode, role
    * check email, password, verifyCode, role
    * check email exit in db
    * check verifyCodeDB code, time createdAt
    * output user id
     */
    svRegister: async (req, res) => {
        const payload = req.body;
        const createdBy = 'system';
        const updatedBy = 'system';
        const userID = uuidv4();
        const roleID = uuidv4();
        const today = new Date();

        if (isEmpty(payload.verifyCode) || isEmpty(payload.password) || isEmpty(payload.role))
            return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.BadRequest,
                    message: setting.SYSTEM_STATUS_MESSAGE.BadRequest
                });
        if (!isEmail(payload.email))
            return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.BadRequest,
                    message: setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT
                });

        try {
            let usersDB = await querySQl(`SELECT *
                                          FROM ${setting.TABLE_DATABASE.USER} as u
                                          WHERE u.email = ?`, [payload.email]);
            if (!isEmpty(usersDB))
                return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: setting.SYSTEM_STATUS_CODE.BadRequest,
                        message: setting.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT
                    });

            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${setting.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`,[payload.email]);

            // Default time createdAt one day
            if (!isEmpty(verifyCodeDB) && timeDiff(today, verifyCodeDB[0]['createdAt'], 1)
                && verifyCodeDB[0]['code'] === payload.verifyCode) {

                const hashPassword = await bcryptHashPassword(payload.password);
                const keyDescRole = findKeyInObject(setting.SYSTEM_ROLE, payload.role);

                await querySQl(`INSERT INTO ${setting.TABLE_DATABASE.USER} (userID, email, password, status, createdBy, updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?)`, [userID, payload.email, hashPassword, setting.SYSTEM_STATUS.ACTIVE, createdBy, updatedBy])

                await querySQl(`INSERT INTO ${setting.TABLE_DATABASE.ROLE} (roleID, userID, name, description, createdBy, updatedBy)
                              VALUES (?, ?, ?, ?, ?, ?)`, [roleID, userID, payload.role, setting.SYSTEM_ROLE_DESC[keyDescRole], createdBy, updatedBy])

                await querySQl(`UPDATE ${setting.TABLE_DATABASE.VERIFY_CODE}
                                SET status = ?
                                WHERE email = ?`
                    , [setting.SYSTEM_STATUS.IN_ACTIVE, payload.email]);

                return res.status(setting.SYSTEM_STATUS_CODE.OK)
                    .json({
                        status: setting.SYSTEM_STATUS_CODE.OK,
                        message: setting.RESPONSE_MESSAGE.SUCCESS_REGISTER_ACCOUNT,
                        data: {userID: userID}
                    });
            }

            return res.status(setting.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.BadRequest,
                    message: setting.RESPONSE_MESSAGE.ERROR_REGISTER_ACCOUNT
                });
        } catch (err) {
            console.error('Error executing query register :', err.stack);
            return res.status(setting.SYSTEM_STATUS_CODE.InternalServerError)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.InternalServerError,
                    message: setting.SYSTEM_STATUS_MESSAGE.InternalServerError
                });
        }
    },
    /*
    * TODO svVerifyCode
    * input email
    * check email, verifyCode
    * if exit email then update verifyCode
    * output verifyCode send to email
     */
    svVerifyCode: async (req, res) => {
        const verifyCode = generateRandomVerifyCode();
        const verifyCodeID = uuidv4();
        const payload = req.body;
        const createdBy = 'system';
        const updatedBy = 'system';

        if (!isEmpty(payload.email))
            return res.json({
                status: setting.SYSTEM_STATUS_CODE.BadRequest,
                message: setting.SYSTEM_STATUS_MESSAGE.INVALID_EMAIL_FORMAT
            });

        try {
            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${setting.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`, [payload.email]);

            if (isEmpty(verifyCodeDB)) {
                await querySQl(`INSERT INTO ${setting.TABLE_DATABASE.VERIFY_CODE} (verifyCodeID, code, email, createdBy, updatedBy)
                                VALUES (?, ?, ?, ?, ?)`, [verifyCodeID, verifyCode, payload.email, createdBy, updatedBy])
            }

            await querySQl(`UPDATE ${setting.TABLE_DATABASE.VERIFY_CODE}
                            SET code      = ?,
                                email     = ?,
                                status    = ?,
                                createdBy = ?,
                                updatedBy = ?
                            WHERE verifyCodeID = ?`,
                [verifyCode, payload.email, setting.SYSTEM_STATUS.ACTIVE, createdBy, updatedBy, verifyCodeDB[0]['verifyCodeID']]);

            await sendEmail(process.env.SERVER_EMAIL_ADDRESS_TEST, process.env.SERVER_NAME, `Mã xác thực của bạn là: ${verifyCode}`)
            return res.status(setting.SYSTEM_STATUS_CODE.OK)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.OK,
                    message: setting.RESPONSE_MESSAGE.SUCCESS_SEND_VERIFY_CODE
                });
        } catch (err) {
            console.error('Error executing query verify code :', err.stack);
            return res.status(setting.SYSTEM_STATUS_CODE.InternalServerError)
                .json({
                    status: setting.SYSTEM_STATUS_CODE.InternalServerError,
                    message: setting.SYSTEM_STATUS_MESSAGE.InternalServerError
                });
        }
    },
    svForgotPassword: async (req, res) => {
        // const email = req.body.email;
        // const password = req.body.password;
        // const verifyCode = req.body.verifyCode;
        // const today = new Date();
        //
        // // Validate
        // if (isEmpty(verifyCode) || isEmpty(password))
        //     return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.SYSTEM_STATUS_MESSAGE.BadRequest, {}));
        // if (!isEmail(email))
        //     return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT, {}));
        //
        // try {
        //     let userDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.USER, [{email: email}]);
        //     if (isEmpty(userDB))
        //         return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT, {}));
        //     if (!isEmpty(userDB) && userDB[0][`status`] !== setting.SYSTEM_STATUS.ACTIVE)
        //         return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_NOT_EXIT_OR_LOCK_ACCOUNT, {}));
        //
        //     const verifyCodeDB = await performSQL(setting.SQL_METHOD.GET, setting.TABLE_DATABASE.VERIFY_CODE, [{email: email}]);
        //
        //     // Default update one day
        //     if (!isEmpty(verifyCodeDB) && timeDiff(today, verifyCodeDB[0]['updatedAt'], 1) && verifyCodeDB[0]['code'] === verifyCode) {
        //         const hashPassword = await bcryptHashPassword(password);
        //         await performSQL(setting.SQL_METHOD.UPDATE, setting.TABLE_DATABASE.USER, [{password: hashPassword},
        //             {_updatedBy: userDB[0]['userID']}, {userID: userDB[0]['userID']}]);
        //
        //         return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.OK, setting.RESPONSE_MESSAGE.SUCCESS_FORGOT_PASSWORD, {}));
        //     }
        //
        //     return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.RESPONSE_MESSAGE.ERROR_FORGOT_PASSWORD, {}));
        // } catch (err) {
        //     console.error('Error executing query forgot password :', err.stack);
        //     return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.InternalServerError, setting.SYSTEM_STATUS_MESSAGE.InternalServerError, {}));
        // }
    },

    /*
    * TODO svRefreshToken
    * input token
    * check token valid expires
    * output token expires
     */
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
                token: refreshToken(token),
            });
        } catch (error) {
            return res
                .status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST)
                .json({message: setting.RESPONSE_MESSAGE.INVALID_TOKEN});
        }
    },
};

module.exports = authService;
