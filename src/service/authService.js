const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const Loger = require('../common/logger')

const {
    isEmpty,
    bcryptComparePassword,
    bcryptHashPassword,
    generateRandomVerifyCode,
    timeDiff,
    filterFields,
    findKeyInObject
} = require('../core/func');
const {refreshToken, generateToken} = require('../common/jsonwebtoken');
const {sendEmail} = require('../common/nodemailer');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

const authService = {
    svLogin: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).max(20).required()
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message
                });
        }

        try {
            let userDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.email = ?`, [payload.email]);
            if (isEmpty(userDB) || !await bcryptComparePassword(payload.password, userDB[0][`password`]))
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD
                    });
            if (userDB[0][`status`] !== constant.SYSTEM_STATUS.ACTIVE)
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.ERROR_LOCK_ACCOUNT
                    });

            let roles = await querySQl(`SELECT ur.userID, ur.roleID, r.name
                                        FROM ${constant.TABLE_DATABASE.USER_ROLE} as ur
                                        JOIN role r ON ur.roleID = r.roleID
                                        WHERE ur.userID = ?`, [userDB[0]['userID']]);
            userDB = filterFields(userDB, ['userID', 'email', 'status']);

            // assign role, token
            userDB[0]['roles'] = isEmpty(roles) ? [] : filterFields(roles, ['name']);
            userDB[0]['token'] = generateToken(userDB[0]);

            return res.status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK, message: constant.RESPONSE_MESSAGE.SUCCESS_LOGIN_ACCOUNT
                    , data: userDB[0]
                });
        } catch (err) {
            console.error('Error executing query login :', err.stack);
            return res.status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },
    svRegister: async (req, res) => {
        const payload = req.body;
        const userID = uuidv4();
        const userRoleID = uuidv4();
        const companyID = uuidv4();
        const today = new Date();

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).max(20).required(),
            role: Joi.string().required(),
            verifyCode: Joi.string().max(6).required(),
            companyName: Joi.string(),
            companyCorporateTaxCode: Joi.string()
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message
                });
        }

        try {
            let userDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.email = ?`, [payload.email]);
            if (!isEmpty(userDB))
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT
                    });

            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${constant.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`, [payload.email]);

            if (isEmpty(verifyCodeDB) || !verifyCodeDB[0]['code'] === payload.verifyCode || !timeDiff(today, verifyCodeDB[0]['createdAt'], 1)) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.ERROR_ENCRYPTION_VERIFY_CODE
                    });
            }

            const hashPassword = await bcryptHashPassword(payload.password);
            // const keyDescRole = findKeyInObject(constant.SYSTEM_ROLE, payload.role);

            if (payload.role === constant.SYSTEM_ROLE.EMPLOYER) {
                let companyDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.COMPANY} as c
                                         WHERE c.corporateTaxCode = ?`, [payload.corporateTaxCode]);

                if (!isEmpty(companyDB))
                    return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                        .json({
                            status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                            massage: constant.RESPONSE_MESSAGE.ERROR_COMPANY_CORPORATE_TAX_CODE_EXIT
                        });

                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.COMPANY} (companyID, name, corporateTaxCode)
                                VALUES (?, ?, ?)`, [companyID, payload.companyName, payload.companyCorporateTaxCode])

                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, email, password, status, companyID)
                                VALUES (?, ?, ?, ?, ?)`, [userID, payload.email, hashPassword, constant.SYSTEM_STATUS.ACTIVE, companyID])
            }

            if (payload.role === constant.SYSTEM_ROLE.CANDIDATE)
                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, email, password, status)
                                VALUES (?, ?, ?, ?)`, [userID, payload.email, hashPassword, constant.SYSTEM_STATUS.ACTIVE])

            let roleDB = await querySQl(`SELECT r.roleID
                                         FROM ${constant.TABLE_DATABASE.ROLE} as r
                                         WHERE r.name = ?`, [payload.role]);

            if (isEmpty(roleDB))
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        massage: constant.RESPONSE_MESSAGE.ERROR_ROLE
                    });

            await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER_ROLE} (roleID, userID)
                            VALUES (?, ?)`, [roleDB[0]['roleID'], userID])

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.VERIFY_CODE}
                            SET status = ?
                            WHERE email = ?`
                , [constant.SYSTEM_STATUS.IN_ACTIVE, payload.email]);

            return res.status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_REGISTER_ACCOUNT,
                    data: {userID: userID}
                });
        } catch (err) {
            console.error('Error executing query register :', err.stack);
            return res.status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },

    svVerifyCode: async (req, res) => {
        const verifyCode = generateRandomVerifyCode();
        const verifyCodeID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message
                });
        }

        try {
            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${constant.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`, [payload.email]);

            if (isEmpty(verifyCodeDB)) {
                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.VERIFY_CODE} (verifyCodeID, code, email)
                                VALUES (?, ?, ?)`, [verifyCodeID, verifyCode, payload.email])
            } else {
                await querySQl(`UPDATE ${constant.TABLE_DATABASE.VERIFY_CODE}
                                SET code      = ?,
                                    email     = ?,
                                    status    = ?,
                                WHERE verifyCodeID = ?`,
                    [verifyCode, payload.email, constant.SYSTEM_STATUS.ACTIVE, verifyCodeDB[0]['verifyCodeID']]);
            }

            await sendEmail(process.env.SERVER_EMAIL_ADDRESS_TEST, process.env.SERVER_NAME, `Mã xác thực của bạn là: ${verifyCode}`)
            return res.status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_SEND_VERIFY_CODE
                });
        } catch (err) {
            console.error('Error executing query verify code :', err.stack);
            return res.status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },

    svForgotPassword: async (req, res) => {
        const payload = req.body;
        const today = new Date();

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).max(20).required(),
            verifyCode: Joi.string().max(6).required()
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message
                });
        }

        try {
            let userDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.email = ?`, [payload.email]);
            if (isEmpty(userDB))
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.ERROR_NOT_EXIT
                    });
            if (userDB[0][`status`] !== constant.SYSTEM_STATUS.ACTIVE)
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.ERROR_LOCK_ACCOUNT
                    });

            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${constant.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`, [payload.email]);

            if (isEmpty(verifyCodeDB) || !verifyCodeDB[0]['code'] === payload.verifyCode || !timeDiff(today, verifyCodeDB[0]['createdAt'], 1)) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.ERROR_ENCRYPTION_VERIFY_CODE
                    });
            }

            const hashPassword = await bcryptHashPassword(payload.password);

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER}
                            SET password  = ?,
                                updatedBy = ?
                            WHERE email = ?`
                , [hashPassword, userDB[0]['userID'], payload.email]);

            return res.status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_FORGOT_PASSWORD
                });
        } catch (err) {
            console.error('Error executing query forgot password :', err.stack);
            return res.status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
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
            return res.status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.SYSTEM_HTTP_MESSAGE.SUCCESS_REFRESH_TOKEN,
                    token: refreshToken(token),
                });
        } catch (error) {
            return res
                .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                .json({message: constant.RESPONSE_MESSAGE.INVALID_TOKEN});
        }
    },
};

module.exports = authService;
