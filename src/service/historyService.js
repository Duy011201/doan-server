const constant = require('../config/constant');
const { querySQl } = require('../core/repository');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { isEmpty } = require('../core/func');
const { PRODUCT_STATUS } = require('../config/constant');

const productService = {
  svGetAll: async (req, res) => {
    const payload = req.body;
    const schema = Joi.object({
      userID: Joi.string().required(),
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
      let historyDB =
        await querySQl(`SELECT h.*, s.servicePackName, s.price, s.promotion, s.content, s.expirationDate, s.image FROM ${constant.TABLE_DATABASE.HISTORY} AS h
            LEFT JOIN ${constant.TABLE_DATABASE.SERVICE_PACK} AS s
                                                   ON s.servicePackID = h.servicePackID
                                                  WHERE h.createdBy = '${payload.userID}'`);
      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        data: historyDB,
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

module.exports = productService;
