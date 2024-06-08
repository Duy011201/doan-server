const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {
    isEmpty,
    findKeyInObject,
    bcryptHashPassword,
} = require('../core/func');

const authService = {
    svCreate: async (req, res) => {
        const userID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            companyID: Joi.string(),
            role: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            avatar: Joi.string().required(),
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

            let userCreatedBy = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER_ROLE} as ur
                                            
                                         WHERE u.userID = ?`, [payload.createdBy]);

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

                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, email, password, status, companyID, createdBy)
                                VALUES (?, ?, ?, ?, ?, ?)`, [userID, payload.email, hashPassword, constant.SYSTEM_STATUS.ACTIVE, payload.companyID, payload.createdBy])
            } else {
                await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.USER} (userID, email, password, status, createdBy)
                                VALUES (?, ?, ?, ?, ?)`, [userID, payload.email, hashPassword, constant.SYSTEM_STATUS.ACTIVE, payload.createdBy])
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
            companyID: Joi.string(),
            roleID: Joi.string().required(),
            username: Joi.string().required(),
            status: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            avatar: Joi.string().required(),
            updatedBy: Joi.string().required(),
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
                                SET username  = ?,
                                    email     = ?,
                                    status    = ?,
                                    phone     = ?,
                                    avatar    = ?,
                                    updatedBy = ?,
                                    companyID
                                WHERE userID = ?`
                    , [payload.username, payload.email, payload.status, payload.phone, payload.avatar, payload.updatedBy, payload.companyID, payload.userID]);
            } else {
                await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER}
                                SET username  = ?,
                                    email     = ?,
                                    status    = ?,
                                    phone     = ?,
                                    avatar    = ?,
                                    updatedBy = ?
                                WHERE userID = ?`
                    , [payload.username, payload.email, payload.status, payload.phone, payload.avatar, payload.updatedBy, payload.userID]);
            }

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.USER_ROLE}
                            SET roleID    = ?,
                                updatedBy = ?
                            WHERE userID = ?`
                , [payload.roleID, payload.updatedBy, payload.userID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.ERROR_REGISTER_ACCOUNT
                });
        } catch (err) {
            console.error('Error executing query register :', err.stack);
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

    svGetAll: async (req, res) => {
        try {
            let userDB =
                await querySQl(`SELECT u.*, r.name as role, c.name as companyName
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
