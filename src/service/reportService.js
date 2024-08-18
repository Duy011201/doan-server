const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {isEmpty} = require('../core/func');

const reportService = {
    svEmployer: async (req, res) => {
        try {
            const payload = req.body;
            const schema = Joi.object({
                userID: Joi.string().allow(''),
                keyword: Joi.string().allow(''),
                token: Joi.string().allow('')
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }

            let sql = '';
            if (payload.keyword === 'candidate') {
                sql = `SELECT rp.createdAt, u.email, r.title
                       FROM ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                INNER JOIN ${constant.TABLE_DATABASE.RECRUITMENT_PROCESS} AS rp
                                          ON rp.recruitmentID = r.recruitmentID
                                LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                          ON u.userID = rp.candidateID
                       WHERE r.userID = ?`;
            } else if (payload.keyword === 'recruitment') {
                sql = `SELECT r.createdAt, u.email
                       FROM ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                          ON u.userID = r.userID
                       WHERE r.userID = ?`;
            }

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: await querySQl(sql, [payload.userID]),
            });
        } catch (err) {
            console.error(`Error executing query get report :`, err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetByID: async (req, res) => {
        try {
            const payload = req.body;
            const schema = Joi.object({
                blogID: Joi.string().required(),
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }
            let sql = `SELECT *
                       FROM ${constant.TABLE_DATABASE.BLOG} AS b
                       WHERE b.blogID = '${payload.blogID}'`;
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: await querySQl(sql),
            });
        } catch (err) {
            console.error('Error executing query get by id blog :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
};

module.exports = reportService;
