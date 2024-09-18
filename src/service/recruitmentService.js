const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {isEmpty} = require('../core/func');

const recruitmentService = {
    svCreate: async (req, res) => {
        const recruitmentID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            userID: Joi.string().required(),
            keyword: Joi.string().required(),
            title: Joi.string().required(),
            address: Joi.string().required(),
            description: Joi.string().required(),
            required: Joi.string().required(),
            province: Joi.string().required(),
            field: Joi.string().required(),
            timeForm: Joi.string().required(),
            timeStart: Joi.string().required(),
            timeEnd: Joi.string().required(),
            salaryFrom: Joi.number().required().min(0).max(999),
            salaryTo: Joi.number().required().min(0).max(999),
            createdBy: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            let recruitmentDB = await querySQl(
                `SELECT *
                 FROM ${constant.TABLE_DATABASE.RECRUITMENT} as r
                 WHERE r.keyword = ?`,
                [payload.keyword]
            );
            if (!isEmpty(recruitmentDB)) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT});
            }

            await querySQl(
                `INSERT INTO ${constant.TABLE_DATABASE.RECRUITMENT} (recruitmentID, userID, status, keyword, title,
                                                                     address,
                                                                     description, required, timeForm, timeStart,
                                                                     timeEnd,
                                                                     province, field, salaryFrom, salaryTo, createdBy)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    recruitmentID,
                    payload.userID,
                    constant.RECRUITMENT.PENDING,
                    payload.keyword,
                    payload.title,
                    payload.address,
                    payload.description,
                    payload.required,
                    payload.timeForm,
                    payload.timeStart,
                    payload.timeEnd,
                    payload.province,
                    payload.field,
                    payload.salaryFrom,
                    payload.salaryTo,
                    payload.createdBy,
                ]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
                data: {recruitmentID: recruitmentID},
            });
        } catch (err) {
            console.error('Error executing query create recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svUpdate: async (req, res) => {
        const payload = req.body;

        const schema = Joi.object({
            recruitmentID: Joi.string().required(),
            userID: Joi.string().required(),
            keyword: Joi.string().required(),
            title: Joi.string().required(),
            address: Joi.string().required(),
            description: Joi.string().required(),
            required: Joi.string().required(),
            province: Joi.string().required(),
            field: Joi.string().required(),
            timeForm: Joi.string().required(),
            timeStart: Joi.string().required(),
            timeEnd: Joi.string().required(),
            salaryFrom: Joi.number().required().min(0).max(999),
            salaryTo: Joi.number().required().min(0).max(999),
            status: Joi.string().required(),
            updatedBy: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            let recruitmentDB = await querySQl(
                `SELECT *
                 FROM ${constant.TABLE_DATABASE.RECRUITMENT} as r
                 WHERE r.keyword = ?`,
                [payload.keyword]
            );
            if (!isEmpty(recruitmentDB) && recruitmentDB.length > 1) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT});
            }

            await querySQl(
                `UPDATE ${constant.TABLE_DATABASE.RECRUITMENT}
                 SET userID      = ?,
                     keyword     = ?,
                     title       = ?,
                     address     = ?,
                     description = ?,
                     required    = ?,
                     province    = ?,
                     field       = ?,
                     timeForm    = ?,
                     timeStart   = ?,
                     timeEnd     = ?,
                     salaryFrom  = ?,
                     salaryTo    = ?,
                     status      = ?,
                     updatedBy   = ?
                 WHERE recruitmentID = ?`,
                [
                    payload.userID,
                    payload.keyword,
                    payload.title,
                    payload.address,
                    payload.description,
                    payload.required,
                    payload.province,
                    payload.field,
                    payload.timeForm,
                    payload.timeStart,
                    payload.timeEnd,
                    payload.salaryFrom,
                    payload.salaryTo,
                    payload.status,
                    payload.updatedBy,
                    payload.recruitmentID,
                ]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE,
            });
        } catch (err) {
            console.error('Error executing query update recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svDelete: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            recruitmentID: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            await querySQl(
                `DELETE
                 FROM ${constant.TABLE_DATABASE.RECRUITMENT} as r
                 WHERE r.recruitmentID = ?`,
                [payload.recruitmentID]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE,
            });
        } catch (err) {
            console.error(
                'Error executing query delete recruitment by id :',
                err.stack
            );
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svStatus: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            recruitmentID: Joi.string().required(),
            updatedBy: Joi.string().required(),
            status: Joi.string().allow(''),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            await querySQl(
                `UPDATE ${constant.TABLE_DATABASE.RECRUITMENT} as r
                 SET r.status    = ?,
                     r.updatedBy = ?
                 WHERE r.recruitmentID = ?`,
                [payload.status, payload.updatedBy, payload.recruitmentID]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE,
            });
        } catch (err) {
            console.error(
                'Error executing query status recruitment by id :',
                err.stack
            );
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetAll: async (req, res) => {
        try {
            const payload = req.body;
            const schema = Joi.object({
                userID: Joi.string().allow(''),
                status: Joi.string().allow(''),
                token: Joi.string().allow(''),
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }
            let sql = `SELECT r.*, u.email
                       FROM ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                          ON u.userID = r.createdBy`;

            let conditions = [];
            let params = [];

            if (!isEmpty(payload.userID)) {
                conditions.push('r.userID = ?');
                params.push(payload.userID);
            }

            if (!isEmpty(payload.status)) {
                conditions.push('r.status = ?');
                params.push(payload.status);
            }

            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }

            sql += ' ORDER BY r.updatedAt DESC';

            let recruitmentDB = await querySQl(sql, params);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: recruitmentDB,
            });
        } catch (err) {
            console.error('Error executing query get all recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetAllHeader: async (req, res) => {
        try {
            const payload = req.body;
            const schema = Joi.object({
                companyID: Joi.string().allow(''),
                recruitmentID: Joi.string().allow(''),
                province: Joi.string().allow(''),
                keyword: Joi.string().allow(''),
                field: Joi.string().allow(''),
                status: Joi.string().allow(''),
                token: Joi.string().allow(''),
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }
            let sql = `SELECT r.*, c.companyID, c.name as companyName, c.logo as companyLogo, c.scale as companyScale,
                            c.field as companyField, c.address as companyAddress
                       FROM ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                          ON u.userID = r.userID
                                LEFT JOIN ${constant.TABLE_DATABASE.COMPANY} AS c
                                          ON c.companyID = u.companyID`;

            let conditions = [];
            let params = [];

            if (!isEmpty(payload.companyID)) {
                conditions.push('c.companyID = ?');
                params.push(payload.companyID);
            }

            if (!isEmpty(payload.status)) {
                conditions.push('r.status = ?');
                params.push(payload.status);
            }

            if (!isEmpty(payload.province)) {
                conditions.push('r.province = ?');
                params.push(payload.province);
            }

            if (!isEmpty(payload.field)) {
                conditions.push('r.field = ?');
                params.push(payload.field);
            }

            if (!isEmpty(payload.recruitmentID)) {
                conditions.push('r.recruitmentID = ?');
                params.push(payload.recruitmentID);
            }

            if (!isEmpty(payload.keyword)) {
                conditions.push('r.keyword LIKE ?');
                params.push(`%${payload.keyword}%`);
            }

            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }

            sql += ' AND r.timeEnd >= NOW() ORDER BY r.updatedAt DESC';

            let recruitmentDB = await querySQl(sql, params);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: recruitmentDB,
            });
        } catch (err) {
            console.error('Error executing query get all header recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },

    svGetAllHome: async (req, res) => {
        try {
            let result =
                await querySQl(`SELECT r.field, COUNT(*) AS count FROM ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                                  GROUP BY r.field ORDER BY count DESC LIMIT 6`);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: result,
            });
        } catch (err) {
            console.error('Error executing query get all home recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },

    svGetAllCountRecruitment: async (req, res) => {
        try {
            let result =
                await querySQl(`SELECT COUNT(*) AS countIn24h, (SELECT COUNT(*) FROM ${constant.TABLE_DATABASE.RECRUITMENT}) AS countAll
                                                  FROM ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                                  WHERE DATE(r.updatedAt) = CURDATE()`);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: result,
            });
        } catch (err) {
            console.error('Error executing query get all home count recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
};

module.exports = recruitmentService;
