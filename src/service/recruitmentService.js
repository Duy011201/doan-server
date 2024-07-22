const constant = require('../config/constant');
const { querySQl } = require('../core/repository');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { isEmpty } = require('../core/func');

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
      salaryFrom: Joi.number().required().min(0),
      salaryTo: Joi.number().required().min(0),
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
      let recruitmentDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.RECRUITMENT} as r
                                         WHERE r.keyword = ?`,
        [payload.keyword]
      );
      if (!isEmpty(recruitmentDB)) {
        return res
          .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
          .json({ message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT });
      }

      await querySQl(
        `INSERT INTO ${constant.TABLE_DATABASE.RECRUITMENT} (recruitmentID, userID, status, keyword, title,
                                                                         address, description, required,
                                                                         province, field, salaryFrom, salaryTo, createdBy)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recruitmentID,
          payload.userID,
          constant.RECRUITMENT.PENDING,
          payload.keyword,
          payload.title,
          payload.address,
          payload.description,
          payload.required,
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
        data: { recruitmentID: recruitmentID },
      });
    } catch (err) {
      console.error('Error executing query create recruitment :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR });
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
      salaryFrom: Joi.number().required().min(0),
      salaryTo: Joi.number().required().min(0),
      salaryFrom: Joi.number().required().min(0),
      salaryTo: Joi.number().required().min(0),
      status: Joi.string().required(),
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
      let recruitmentDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.RECRUITMENT} as r
                                         WHERE r.keyword = ?`,
        [payload.keyword]
      );
      if (!isEmpty(recruitmentDB) && recruitmentDB.length > 1) {
        return res
          .status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
          .json({ message: constant.RESPONSE_MESSAGE.ERROR_KEYWORD_EXIT });
      }

      await querySQl(
        `UPDATE ${constant.TABLE_DATABASE.RECRUITMENT}
                            SET userID     = ?,
                                keyword   = ?,
                                title   = ?,
                                address   = ?,
                                description   = ?,
                                required   = ?,
                                province = ?,
                                field = ?,
                                salaryFrom   = ?,
                                salaryTo   = ?,
                                status    = ?,
                                updatedBy = ?
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

    const { error } = schema.validate(payload);
    if (error) {
      return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
        massage: error.details[0].message,
      });
    }

    try {
      await querySQl(
        `UPDATE ${constant.TABLE_DATABASE.RECRUITMENT} as r
                            SET r.status = ?,
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
        token: Joi.string().required(),
      });

      const { error } = schema.validate(payload);
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
};

module.exports = recruitmentService;
