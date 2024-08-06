const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {isEmpty} = require('../core/func');

const recruitmentProcessService = {
    svCreate: async (req, res) => {
        const recruitmentProcessID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            recruitmentID: Joi.string().required(),
            candidateID: Joi.string().required(),
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
                 FROM ${constant.TABLE_DATABASE.RECRUITMENT_PROCESS} as r
                 WHERE r.recruitmentID = ?`,
                [payload.recruitmentID]
            );
            if (!isEmpty(recruitmentDB)) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({message: constant.RESPONSE_MESSAGE.ERROR_RECRUITMENT_EXIT});
            }

            await querySQl(
                `INSERT INTO ${constant.TABLE_DATABASE.RECRUITMENT_PROCESS} (recruitmentProcessID, recruitmentID,
                                                                             candidateID, createdBy)
                 VALUES (?, ?, ?, ?)`,
                [
                    recruitmentProcessID,
                    payload.recruitmentID,
                    payload.candidateID,
                    payload.createdBy,
                ]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
                data: {recruitmentProcessID: recruitmentProcessID},
            });
        } catch (err) {
            console.error('Error executing query create recruitment process :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svDelete: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            recruitmentProcessID: Joi.string().required(),
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
                 FROM ${constant.TABLE_DATABASE.RECRUITMENT_PROCESS} as r
                 WHERE r.recruitmentProcessID = ?`,
                [payload.recruitmentProcessID]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE,
            });
        } catch (err) {
            console.error(
                'Error executing query delete recruitment process by id :',
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
    svGetAllEmployer: async (req, res) => {
        try {
            const payload = req.body;
            const schema = Joi.object({
                recruitmentID: Joi.string().allow(''),
                userID: Joi.string().allow(''),
                token: Joi.string().required(),
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }
            let sql = `SELECT rp.recruitmentProcessID, r.recruitmentID, r.userID, r.title, u.email , u.profile, u.avatar
                       FROM ${constant.TABLE_DATABASE.RECRUITMENT_PROCESS} AS rp
                                LEFT JOIN ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                          ON r.recruitmentID = rp.recruitmentID
                                LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                          ON u.userID = rp.candidateID`;

            let conditions = [];
            let params = [];

            if (!isEmpty(payload.userID)) {
                conditions.push('r.userID = ?');
                params.push(payload.userID);
            }

            if (!isEmpty(payload.recruitmentID)) {
                conditions.push('r.recruitmentID = ?');
                params.push(payload.recruitmentID);

                conditions.push('r.status = ?');
                params.push(constant.RECRUITMENT.PUBLISHED);
            }

            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }

            sql += ' ORDER BY rp.createdAt DESC';

            let recruitmentDB = await querySQl(sql, params);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: recruitmentDB,
            });
        } catch (err) {
            console.error('Error executing query get all employer recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetAllCandidate: async (req, res) => {
        try {
            const payload = req.body;
            const schema = Joi.object({
                candidateID: Joi.string().required(),
                token: Joi.string().required(),
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }
            let sql = `SELECT rp.recruitmentProcessID, r.*
                       FROM ${constant.TABLE_DATABASE.RECRUITMENT_PROCESS} AS rp
                                LEFT JOIN ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                          ON r.recruitmentID = rp.recruitmentID`;

            let conditions = [];
            let params = [];

            if (!isEmpty(payload.candidateID)) {
                conditions.push('rp.candidateID = ?');
                params.push(payload.candidateID);

                conditions.push('r.status = ?');
                params.push(constant.RECRUITMENT.PUBLISHED);
            }

            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }

            sql += ' ORDER BY rp.createdAt DESC';

            let recruitmentDB = await querySQl(sql, params);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: recruitmentDB,
            });
        } catch (err) {
            console.error('Error executing query get all employer recruitment :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    }
};

module.exports = recruitmentProcessService;
