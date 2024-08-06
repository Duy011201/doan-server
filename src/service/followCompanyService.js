const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {isEmpty} = require('../core/func');

const followCompanyService = {
    svCreate: async (req, res) => {
        const followCompanyID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            userID: Joi.string().required(),
            companyID: Joi.string().required(),
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
            let flowCompanyDB = await querySQl(
                `SELECT *
                 FROM ${constant.TABLE_DATABASE.FOLLOW_COMPANY} as f
                 WHERE f.userID = ?
                   and f.companyID`,
                [payload.userID, payload.companyID]
            );
            if (!isEmpty(flowCompanyDB)) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({message: constant.RESPONSE_MESSAGE.ERROR_COMPANY_EXIT});
            }

            await querySQl(
                `INSERT INTO ${constant.TABLE_DATABASE.FOLLOW_COMPANY} (followCompanyID, userID,
                                                                        companyID, createdBy)
                 VALUES (?, ?, ?, ?)`,
                [
                    followCompanyID,
                    payload.userID,
                    payload.companyID,
                    payload.createdBy,
                ]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
                data: {followCompanyID: followCompanyID},
            });
        } catch (err) {
            console.error('Error executing query create follow company :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svDelete: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            followCompanyID: Joi.string().required(),
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
                 FROM ${constant.TABLE_DATABASE.FOLLOW_COMPANY} as r
                 WHERE r.flowCompanyID = ?`,
                [payload.flowCompanyID]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE,
            });
        } catch (err) {
            console.error(
                'Error executing query delete follow company by id :',
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
                token: Joi.string().required(),
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }
            let flowCompanyDB = await querySQl(`SELECT f.followCompanyID, u.companyID, c.name as companyName, c.logo as companyLogo,
                                                       COUNT(r.recruitmentID) AS recruitmentCount
                                                FROM ${constant.TABLE_DATABASE.FOLLOW_COMPANY} AS f
                                                         LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                                                   ON u.userID = f.userID
                                                         LEFT JOIN ${constant.TABLE_DATABASE.COMPANY} AS c
                                                                   ON c.companyID = f.companyID
                                                         LEFT JOIN ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                                                   ON r.userID = f.userID
                                                WHERE f.userID = ? AND r.status = '${constant.RECRUITMENT.PUBLISHED}'
                                                GROUP BY f.followCompanyID, f.userID, u.companyID, c.name, c.logo`, [payload.userID]);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: flowCompanyDB,
            });
        } catch (err) {
            console.error('Error executing query get all follow company :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
};

module.exports = followCompanyService;
