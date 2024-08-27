const constant = require('../config/constant');
const { querySQl } = require('../core/repository');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { isEmpty } = require('../core/func');

const blogService = {
  svCreate: async (req, res) => {
    const blogID = uuidv4();
    const payload = req.body;

    const schema = Joi.object({
      title: Joi.string().required(),
      keyword: Joi.string().required(),
      content: Joi.string().required(),
      image: Joi.string().required(),
      createdBy: Joi.string().required(),
      token: Joi.string().required(),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
        massage: error.details[0].message,
      });
    }

    try {
      let blogDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.BLOG} as u
                                         WHERE u.keyword = ?`,
        [payload.keyword]
      );
      if (!isEmpty(blogDB)) {
        return res
          .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
          .json({ message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT });
      }

      await querySQl(
        `INSERT INTO ${constant.TABLE_DATABASE.BLOG} (blogID, title, keyword, content,
                                                                        image ,createdBy, userID)
                            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          blogID,
          payload.title,
          payload.keyword,
          payload.content,
          payload.image,
          payload.createdBy,
          payload.createdBy,
        ]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
        data: { blogID: blogID },
      });
    } catch (err) {
      console.error('Error executing query create blog :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR });
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
      image: Joi.string().required(),
      updatedBy: Joi.string().required(),
      token: Joi.string().required(),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
        massage: error.details[0].message,
      });
    }

    try {
      let blogDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.BLOG} as u
                                         WHERE u.keyword = ?`,
        [payload.keyword]
      );
      if (!isEmpty(blogDB) && blogDB.length > 1) {
        return res
          .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
          .json({ message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT });
      }

      await querySQl(
        `UPDATE ${constant.TABLE_DATABASE.BLOG}
                            SET title     = ?,
                                keyword   = ?,
                                content   = ?,
                                image     = ?,
                                status    = ?,
                                updatedBy = ?
                            WHERE blogID = ?`,
        [
          payload.title,
          payload.keyword,
          payload.content,
          payload.image,
          payload.status,
          payload.updatedBy,
          payload.blogID,
        ]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE,
      });
    } catch (err) {
      console.error('Error executing query update blog :', err.stack);
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
      blogID: Joi.string().required(),
      token: Joi.string().required(),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
        massage: error.details[0].message,
      });
    }

    try {
      await querySQl(
        `DELETE
                            FROM ${constant.TABLE_DATABASE.BLOG} as b
                            WHERE b.blogID = ?`,
        [payload.blogID]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE,
      });
    } catch (err) {
      console.error('Error executing query delete blog by id :', err.stack);
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
      blogID: Joi.string().required(),
      updatedBy: Joi.string().required(),
      status: Joi.string().required(),
      token: Joi.string().required(),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
        massage: error.details[0].message,
      });
    }

    try {
      await querySQl(
        `UPDATE ${constant.TABLE_DATABASE.BLOG} as b
                            SET b.status = ?,
                            b.updatedBy = ?
                            WHERE b.blogID = ?`,
        [payload.status, payload.updatedBy, payload.blogID]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE,
      });
    } catch (err) {
      console.error('Error executing query status blog by id :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
        });
    }
  },
  svView: async (req, res) => {
    const payload = req.body;
    const schema = Joi.object({
      blogID: Joi.string().required(),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
        massage: error.details[0].message,
      });
    }

    try {
      let blogDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.BLOG} as b
                                         WHERE b.blogID = ?`,
        [payload.blogID]
      );

      await querySQl(
        `UPDATE ${constant.TABLE_DATABASE.BLOG} as b
                            SET b.view = ?
                            WHERE b.blogID = ?`,
        [blogDB[0].view + 1, payload.blogID]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE,
      });
    } catch (err) {
      console.error('Error executing query status blog by id :', err.stack);
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
        keyword: Joi.string().allow(''),
        token: Joi.string().allow('')
      });

      const { error } = schema.validate(payload);
      if (error) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
          massage: error.details[0].message,
        });
      }
      let sql = `SELECT b.*, u.username, u.email
                                FROM ${constant.TABLE_DATABASE.BLOG} AS b
                                         LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                                   ON u.userID = b.createdBy`;

      let conditions = [];
      let params = [];

      if (payload && typeof payload === 'object') {
        if (!isEmpty(payload.userID)) {
          conditions.push('b.createdBy = ?');
          params.push(payload.userID);
        }

        if (!isEmpty(payload.status)) {
          conditions.push('b.status = ?');
          params.push(payload.status);
        }

        if (!isEmpty(payload.keyword)) {
          conditions.push('b.keyword LIKE ?');
          params.push(`%${payload.keyword}%`);
        }
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }
      sql += ' ORDER BY b.updatedAt DESC';
      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        data: await querySQl(sql, params),
      });
    } catch (err) {
      console.error('Error executing query get all blog :', err.stack);
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

      const { error } = schema.validate(payload);
      if (error) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
          massage: error.details[0].message,
        });
      }
      let sql = `SELECT * FROM ${constant.TABLE_DATABASE.BLOG} AS b WHERE b.blogID = '${payload.blogID}'`;
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

module.exports = blogService;
