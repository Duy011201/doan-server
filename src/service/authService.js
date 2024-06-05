const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');

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
            return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.BadRequest,
                    massage: error.details[0].message
                });
        }

        try {
            let userDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.email = ?`, [payload.email]);
            if (isEmpty(userDB) || !await bcryptComparePassword(payload.password, userDB[0][`password`]))
                return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: constant.SYSTEM_STATUS_CODE.BadRequest,
                        message: constant.RESPONSE_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD
                    });
            if (userDB[0][`status`] !== constant.SYSTEM_STATUS.ACTIVE)
                return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: constant.SYSTEM_STATUS_CODE.BadRequest,
                        message: constant.RESPONSE_MESSAGE.ERROR_LOCK_ACCOUNT
                    });

            let roles = await querySQl(`SELECT *
                                        FROM ${constant.TABLE_DATABASE.ROLE} as r
                                        WHERE r.userID = ?`, [userDB[0]['userID']]);
            userDB = filterFields(userDB, ['userID', 'email', 'status']);

            // assign role, token
            userDB[0]['roles'] = isEmpty(roles) ? [] : filterFields(roles, ['name']);
            [0]['token'] = generateToken(userDB[0]);

            return res.status(constant.SYSTEM_STATUS_CODE.OK)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.OK, message: constant.RESPONSE_MESSAGE.SUCCESS_LOGIN_ACCOUNT
                    , data: userDB[0]
                });
        } catch (err) {
            console.error('Error executing query login :', err.stack);
            return res.status(constant.SYSTEM_STATUS_CODE.InternalServerError)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.InternalServerError,
                    message: constant.SYSTEM_STATUS_MESSAGE.InternalServerError
                });
        }
    },
    svRegister: async (req, res) => {
        const payload = req.body;
        const createdBy = 'system';
        const updatedBy = 'system';
        const userID = uuidv4();
        const roleID = uuidv4();
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
            return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.BadRequest,
                    massage: error.details[0].message
                });
        }

        try {
            let userDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.email = ?`, [payload.email]);
            if (!isEmpty(userDB))
                return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: constant.SYSTEM_STATUS_CODE.BadRequest,
                        message: constant.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT
                    });

            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${constant.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`, [payload.email]);

            if (isEmpty(verifyCodeDB) || !verifyCodeDB[0]['code'] === payload.verifyCode || !timeDiff(today, verifyCodeDB[0]['createdAt'], 1)) {
                return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: constant.SYSTEM_STATUS_CODE.BadRequest,
                        message: constant.RESPONSE_MESSAGE.ERROR_ENCRYPTION_VERIFY_CODE
                    });
            }

            const hashPassword = await bcryptHashPassword(payload.password);
            const keyDescRole = findKeyInObject(constant.SYSTEM_ROLE, payload.role);

            if (payload.role === constant.SYSTEM_ROLE.EMPLOYER) {
                if (isEmpty(payload.companyName))
                    return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                        .json({
                            status: constant.SYSTEM_STATUS_CODE.BadRequest,
                            massage: constant.RESPONSE_MESSAGE.INVALID_COMPANY_NAME
                        });
                if (isEmpty(payload.companyCorporateTaxCode))
                    return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                        .json({
                            status: constant.SYSTEM_STATUS_CODE.BadRequest,
                            massage: constant.RESPONSE_MESSAGE.INVALID_COMPANY_CORPORATE_TAX_CODE
                        });

                let companyDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.COMPANY} as c
                                         WHERE c.corporateTaxCode = ?`, [payload.corporateTaxCode]);

                if (!isEmpty(companyDB))
                    return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                        .json({
                            status: constant.SYSTEM_STATUS_CODE.BadRequest,
                            massage: constant.RESPONSE_MESSAGE.ERROR_COMPANY_CORPORATE_TAX_CODE_EXIT
                        });

                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.COMPANY} (companyID, name, corporateTaxCode, createdBy, updatedBy)
                                VALUES (?, ?, ?, ?, ?)`, [companyID, payload.companyName, payload.companyCorporateTaxCode, createdBy, updatedBy])

                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, email, password, status, companyID, createdBy, updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?, ?)`, [userID, payload.email, hashPassword, constant.SYSTEM_STATUS.ACTIVE, companyID, createdBy, updatedBy])
            }

            if (payload.role === constant.SYSTEM_ROLE.CANDIDATE)
                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, email, password, status, createdBy, updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?)`, [userID, payload.email, hashPassword, constant.SYSTEM_STATUS.ACTIVE, createdBy, updatedBy])

            await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.ROLE} (roleID, userID, name, description, createdBy, updatedBy)
                            VALUES (?, ?, ?, ?, ?, ?)`, [roleID, userID, payload.role, constant.SYSTEM_ROLE_DESC[keyDescRole], createdBy, updatedBy])

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.VERIFY_CODE}
                            SET status = ?
                            WHERE email = ?`
                , [constant.SYSTEM_STATUS.IN_ACTIVE, payload.email]);

            return res.status(constant.SYSTEM_STATUS_CODE.OK)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_REGISTER_ACCOUNT,
                    data: {userID: userID}
                });
        } catch (err) {
            console.error('Error executing query register :', err.stack);
            return res.status(constant.SYSTEM_STATUS_CODE.InternalServerError)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.InternalServerError,
                    message: constant.SYSTEM_STATUS_MESSAGE.InternalServerError
                });
        }
    },

    svVerifyCode: async (req, res) => {
        const verifyCode = generateRandomVerifyCode();
        const verifyCodeID = uuidv4();
        const payload = req.body;
        const createdBy = 'system';
        const updatedBy = 'system';

        const schema = Joi.object({
            email: Joi.string().email().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.BadRequest,
                    massage: error.details[0].message
                });
        }

        try {
            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${constant.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`, [payload.email]);

            if (isEmpty(verifyCodeDB)) {
                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.VERIFY_CODE} (verifyCodeID, code, email, createdBy, updatedBy)
                                VALUES (?, ?, ?, ?, ?)`, [verifyCodeID, verifyCode, payload.email, createdBy, updatedBy])
            } else {
                await querySQl(`UPDATE ${constant.TABLE_DATABASE.VERIFY_CODE}
                                SET code      = ?,
                                    email     = ?,
                                    status    = ?,
                                    createdBy = ?,
                                    updatedBy = ?
                                WHERE verifyCodeID = ?`,
                    [verifyCode, payload.email, constant.SYSTEM_STATUS.ACTIVE, createdBy, updatedBy, verifyCodeDB[0]['verifyCodeID']]);
            }

            await sendEmail(process.env.SERVER_EMAIL_ADDRESS_TEST, process.env.SERVER_NAME, `Mã xác thực của bạn là: ${verifyCode}`)
            return res.status(constant.SYSTEM_STATUS_CODE.OK)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_SEND_VERIFY_CODE
                });
        } catch (err) {
            console.error('Error executing query verify code :', err.stack);
            return res.status(constant.SYSTEM_STATUS_CODE.InternalServerError)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.InternalServerError,
                    message: constant.SYSTEM_STATUS_MESSAGE.InternalServerError
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
            return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.BadRequest,
                    massage: error.details[0].message
                });
        }

        try {
            let userDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.email = ?`, [payload.email]);
            if (isEmpty(userDB))
                return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: constant.SYSTEM_STATUS_CODE.BadRequest,
                        message: constant.RESPONSE_MESSAGE.ERROR_NOT_EXIT
                    });
            if (userDB[0][`status`] !== constant.SYSTEM_STATUS.ACTIVE)
                return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: constant.SYSTEM_STATUS_CODE.BadRequest,
                        message: constant.RESPONSE_MESSAGE.ERROR_LOCK_ACCOUNT
                    });

            const verifyCodeDB = await querySQl(`SELECT *
                                                 FROM ${constant.TABLE_DATABASE.VERIFY_CODE} as v
                                                 WHERE v.email = ?`, [payload.email]);

            if (isEmpty(verifyCodeDB) || !verifyCodeDB[0]['code'] === payload.verifyCode || !timeDiff(today, verifyCodeDB[0]['createdAt'], 1)) {
                return res.status(constant.SYSTEM_STATUS_CODE.BadRequest)
                    .json({
                        status: constant.SYSTEM_STATUS_CODE.BadRequest,
                        message: constant.RESPONSE_MESSAGE.ERROR_ENCRYPTION_VERIFY_CODE
                    });
            }

            const hashPassword = await bcryptHashPassword(payload.password);

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER}
                            SET password  = ?,
                                updatedBy = ?
                            WHERE email = ?`
                , [hashPassword, userDB[0]['userID'], payload.email]);

            return res.status(constant.SYSTEM_STATUS_CODE.OK)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_FORGOT_PASSWORD
                });
        } catch (err) {
            console.error('Error executing query forgot password :', err.stack);
            return res.status(constant.SYSTEM_STATUS_CODE.InternalServerError)
                .json({
                    status: constant.SYSTEM_STATUS_CODE.InternalServerError,
                    message: constant.SYSTEM_STATUS_MESSAGE.InternalServerError
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
            return res.status(constant.SYSTEM_STATUS_CODE.OK).json({
                message: constant.SYSTEM_STATUS_MESSAGE.SUCCESS_REFRESH_TOKEN,
                token: refreshToken(token),
            });
        } catch (error) {
            return res
                .status(constant.SYSTEM_STATUS_CODE.BAD_REQUEST)
                .json({message: constant.RESPONSE_MESSAGE.INVALID_TOKEN});
        }
    },
};

module.exports = authService;
