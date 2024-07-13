const constant = require('../config/constant');
const { querySQl } = require('../core/repository');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { isEmpty, bcryptHashPassword } = require('../core/func');

const serviceService = {
  svCreate: async (req, res) => {
    const servicePackID = uuidv4();
    const payload = req.body;

    const schema = Joi.object({
      servicePackName: Joi.string().required(),
      price: Joi.number().required(),
      content: Joi.string().required(),
      promotion: Joi.number().required(),
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
      let serviceDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.SERVICE_PACK} as s
                                         WHERE s.servicePackName = ?`,
        [payload.servicePackName]
      );
      if (!isEmpty(serviceDB)) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          message: constant.RESPONSE_MESSAGE.ERROR_SERVICE_PACK_NAME,
        });
      }

      await querySQl(
        `INSERT INTO ${constant.TABLE_DATABASE.SERVICE_PACK} (servicePackID, servicePackName, price, content, promotion, createdBy)
                            VALUES (?, ?, ?, ?, ?, ?)`,
        [
          servicePackID,
          payload.servicePackName,
          payload.price,
          payload.content,
          payload.promotion,
          payload.createdBy,
        ]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
        data: { servicePackID: servicePackID },
      });
    } catch (err) {
      console.error('Error executing query create service pack :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR });
    }
  },

  svUpdate: async (req, res) => {
    const payload = req.body;

    const schema = Joi.object({
      servicePackID: Joi.string().required(),
      servicePackName: Joi.string().required(),
      price: Joi.number().required(),
      content: Joi.string().required(),
      promotion: Joi.number().required(),
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
      let servicePackDB = await querySQl(
        `SELECT *
                                          FROM ${constant.TABLE_DATABASE.SERVICE_PACK} as s
                                          WHERE s.servicePackID = ?`,
        [payload.servicePackID]
      );

      if (isEmpty(servicePackDB)) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
          message: constant.RESPONSE_MESSAGE.ERROR_NOT_FOUND_SERVICE_PACK,
        });
      }

      await querySQl(
        `UPDATE ${constant.TABLE_DATABASE.SERVICE_PACK}
                            SET servicePackName = ?,
                                price = ?,
                                content = ?,
                                promotion = ?,
                                updatedBy = ?
                            WHERE servicePackID = ?`,
        [
          payload.servicePackName,
          payload.price,
          payload.content,
          payload.promotion,
          payload.updatedBy,
          payload.servicePackID,
        ]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE,
      });
    } catch (err) {
      console.error('Error executing query update service pack :', err.stack);
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
      servicePackID: Joi.string().required(),
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
        `DELETE FROM ${constant.TABLE_DATABASE.SERVICE_PACK} as u
                            WHERE u.servicePackID = ?`,
        [payload.servicePackID]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE,
      });
    } catch (err) {
      console.error(
        'Error executing query delete service pack by id :',
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
      let servicePackDB = await querySQl(
        `SELECT * FROM ${constant.TABLE_DATABASE.SERVICE_PACK} AS s`
      );
      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        data: servicePackDB,
      });
    } catch (err) {
      console.error('Error executing query get all service pack :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
        });
    }
  },
};

module.exports = serviceService;
