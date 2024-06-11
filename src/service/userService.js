const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {
    isEmpty,
    bcryptHashPassword,
} = require('../core/func');

const authService = {
    svCreate: async (req, res) => {
        const userID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            companyID: Joi.string().allow(''),
            language: Joi.string().allow(''),
            certificate: Joi.string().allow(''),
            education: Joi.string().allow(''),
            username: Joi.string().allow(''),
            role: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().allow(''),
            avatar: Joi.string().allow(''),
            createdBy: Joi.string().required(),
            token: Joi.string().required()
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
            // Default password
            const password = '12345';
            const hashPassword = await bcryptHashPassword(password);
            // const keyDescRole = findKeyInObject(constant.SYSTEM_ROLE, payload.role);

            let userDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.email = ?`, [payload.email]);
            if (!isEmpty(userDB)) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({message: constant.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT});
            }

            if (!isEmpty(payload.companyID)) {
                let companyDB = await querySQl(`SELECT *
                                                FROM ${constant.TABLE_DATABASE.COMPANY} as c
                                                WHERE c.companyID = ?`, [payload.companyID]);

                if (isEmpty(companyDB))
                    return res
                        .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                        .json({message: constant.RESPONSE_MESSAGE.ERROR_COMPANY_NOT_EXIT});

                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, companyID, username, email,
                                                                             password,
                                                                             phone, avatar, status, language,
                                                                             certificate,
                                                                             education, createdBy)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, payload.companyID, payload.username,
                    payload.email, hashPassword, payload.phone, payload.avatar, constant.SYSTEM_STATUS.ACTIVE, payload.language,
                    payload.certificate, payload.education, payload.createdBy])
            } else {
                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, username, email, password,
                                                                             phone, avatar, status, language,
                                                                             certificate,
                                                                             education, createdBy)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, payload.username, payload.email,
                    hashPassword, payload.phone, payload.avatar, constant.SYSTEM_STATUS.ACTIVE, payload.language,
                    payload.certificate, payload.education, payload.createdBy])
            }

            let roleDB = await querySQl(`SELECT r.roleID
                                         FROM ${constant.TABLE_DATABASE.ROLE} as r
                                         WHERE r.name = ?`, [payload.role]);

            await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER_ROLE} (roleID, userID, createdBy)
                            VALUES (?, ?, ?)`, [roleDB[0]['roleID'], userID, payload.createdBy])

            return res.status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
                    data: {userID: userID}
                });
        } catch (err) {
            console.error('Error executing query create user :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svUpdate: async (req, res) => {
        const payload = req.body;

        const schema = Joi.object({
            userID: Joi.string().required(),
            roleID: Joi.string().required(),
            username: Joi.string().allow(''),
            status: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().allow(''),
            avatar: Joi.string().allow(''),
            updatedBy: Joi.string().required(),
            companyID: Joi.string().allow(''),
            language: Joi.string().allow(''),
            certificate: Joi.string().allow(''),
            education: Joi.string().allow(''),
            token: Joi.string().required()
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
                                         WHERE u.userID = ?`, [payload.userID]);

            if (isEmpty(userDB)) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        message: constant.RESPONSE_MESSAGE.ERROR_USER_NOT_EXIT
                    });
            }

            if (!isEmpty(payload.companyID)) {
                let companyDB = await querySQl(`SELECT *
                                                FROM ${constant.TABLE_DATABASE.COMPANY} as c
                                                WHERE c.companyID = ?`, [payload.companyID]);

                if (isEmpty(companyDB))
                    return res
                        .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                        .json({
                            status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                            message: constant.RESPONSE_MESSAGE.ERROR_COMPANY_NOT_EXIT
                        });

                await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER}
                                SET username    = ?,
                                    companyID   = ?,
                                    email       = ?,
                                    avatar      = ?,
                                    phone       = ?,
                                    status      = ?,
                                    language    = ?,
                                    certificate = ?,
                                    education   = ?,
                                    updatedBy   = ?
                                WHERE userID = ?`
                    , [payload.username, payload.companyID, payload.email, payload.avatar, payload.phone, payload.status,
                        payload.language, payload.certificate, payload.education, payload.updatedBy, payload.userID]);
            } else {
                await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER}
                                SET username    = ?,
                                    email       = ?,
                                    avatar      = ?,
                                    phone       = ?,
                                    status      = ?,
                                    language    = ?,
                                    certificate = ?,
                                    education   = ?,
                                    updatedBy   = ?
                                WHERE userID = ?`
                    , [payload.username, payload.email, payload.avatar, payload.phone, payload.status,
                        payload.language, payload.certificate, payload.education, payload.updatedBy, payload.userID]);
            }

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER_ROLE}
                            SET roleID    = ?,
                                updatedBy = ?
                            WHERE userID = ?`
                , [payload.roleID, payload.updatedBy, payload.userID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE_USER
                });
        } catch (err) {
            console.error('Error executing query update :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },
    svDelete: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            userID: Joi.string().required(),
            token: Joi.string().required()
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
            await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER} as u
                            SET u.status = ?
                            WHERE u.userID = ?`, [constant.SYSTEM_STATUS.IN_ACTIVE, payload.userID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE
                });
        } catch (err) {
            console.error('Error executing query delete user by id :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },
    svLock: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            userID: Joi.string().required(),
            token: Joi.string().required()
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
            await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER} as u
                            SET u.status = ?
                            WHERE u.userID = ?`, [constant.SYSTEM_STATUS.LOCK, payload.userID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE
                });
        } catch (err) {
            console.error('Error executing query lock user by id :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },
    svGetAll: async (req, res) => {
        try {
            let userDB =
                await querySQl(`SELECT u.*, r.roleID, r.name as roleName, c.name as companyName
                                FROM ${constant.TABLE_DATABASE.USER} AS u
                                         LEFT JOIN ${constant.TABLE_DATABASE.USER_ROLE} AS ur
                                                   ON u.userID = ur.userID
                                         LEFT JOIN ${constant.TABLE_DATABASE.COMPANY} AS c
                                                   ON c.companyID = u.companyID
                                         LEFT JOIN ${constant.TABLE_DATABASE.ROLE} AS r
                                                   ON ur.roleID = r.roleID
                                WHERE u.status = '${constant.SYSTEM_STATUS.ACTIVE}'
                                   or u.status = '${constant.SYSTEM_STATUS.LOCK}'`);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: userDB
            });
        } catch (err) {
            console.error('Error executing query get all user :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },

    svResetPassword: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            userID: Joi.string().required(),
            token: Joi.string().required()
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
            const password = '12345';
            const hashPassword = await bcryptHashPassword(password);

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER} as u
                            SET u.password = ?
                            WHERE u.userID = ?`, [hashPassword, payload.userID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_RESET_PASSWORD
                });
        } catch (err) {
            console.error('Error executing query reset password user by id :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    }
};

module.exports = authService;
