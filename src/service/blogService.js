const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {
    isEmpty,
} = require('../core/func');

const blogService = {
    svCreate: async (req, res) => {
        const blogID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            title: Joi.string().required(),
            keyword: Joi.string().required(),
            content: Joi.string().required(),
            createdBy: Joi.string().required(),
            token: Joi.string().required(),
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
            let blogDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.BLOG} as u
                                         WHERE u.keyword = ?`, [payload.keyword]);
            if (!isEmpty(blogDB)) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT});
            }

            await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.BLOG} (blogID, title, keyword, content,
                                                                         createdBy)
                            VALUES (?, ?, ?, ?, ?)`, [blogID, payload.title, payload.keyword,
                payload.content, payload.createdBy])

            return res.status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
                    data: {blogID: blogID}
                });
        } catch (err) {
            console.error('Error executing query create blog :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svUpdate: async (req, res) => {
        const payload = req.body;

        const schema = Joi.object({
            blogID: Joi.string().required(),
            title: Joi.string().required(),
            keyword: Joi.string().required(),
            content: Joi.string().required(),
            status: Joi.string().required(),
            updatedBy: Joi.string().required(),
            token: Joi.string().required(),
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
            let blogDB = await querySQl(`SELECT *
                                         FROM ${constant.TABLE_DATABASE.BLOG} as u
                                         WHERE u.keyword = ?`, [payload.keyword]);
            if (!isEmpty(blogDB) && blogDB.length > 1) {
                return res
                    .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT});
            }

            await querySQl(`UPDATE ${constant.TABLE_DATABASE.BLOG}
                            SET title     = ?,
                                keyword   = ?,
                                content   = ?,
                                status    = ?,
                                updatedBy = ?
                            WHERE blogID = ?`
                , [payload.title, payload.keyword, payload.content, payload.status, payload.updatedBy, payload.blogID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE
                });
        } catch (err) {
            console.error('Error executing query update blog :', err.stack);
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
            blogID: Joi.string().required(),
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
            await querySQl(`DELETE
                            FROM ${constant.TABLE_DATABASE.BLOG} as b
                            WHERE b.blogID = ?`, [payload.blogID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE
                });
        } catch (err) {
            console.error('Error executing query delete blog by id :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },
    svStatus: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            blogID: Joi.string().required(),
            status: Joi.string().required(),
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
            await querySQl(`UPDATE ${constant.TABLE_DATABASE.BLOG} as b
                            SET b.status = ?
                            WHERE b.blogID = ?`, [payload.status, payload.blogID]);

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    message: constant.RESPONSE_MESSAGE.SUCCESS_LOCK
                });
        } catch (err) {
            console.error('Error executing query status blog by id :', err.stack);
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
            let blogDB =
                await querySQl(`SELECT b.*, u.username
                                FROM ${constant.TABLE_DATABASE.BLOG} AS b
                                         LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                                   ON u.userID = b.createdBy`);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: blogDB
            });
        } catch (err) {
            console.error('Error executing query get all blog :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },
};

module.exports = blogService;
