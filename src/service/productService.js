const constant = require('../config/constant');
const { querySQl } = require('../core/repository');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { isEmpty } = require('../core/func');
const { PRODUCT_STATUS } = require('../config/constant');

const productService = {
  svCreate: async (req, res) => {
    const productID = uuidv4();
    const payload = req.body;

    const schema = Joi.object({
      servicePackID: Joi.string().required(),
      userID: Joi.string().required(),
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
      let servicePackDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.SERVICE_PACK} as s
                                         WHERE s.servicePackID = ?`,
        [payload.servicePackID]
      );
      if (isEmpty(servicePackDB)) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          message: constant.RESPONSE_MESSAGE.ERROR_NOT_FOUND_SERVICE_PACK,
        });
      }

      // let servicePack2DB = await querySQl(
      //   `SELECT *
      //                                    FROM ${constant.TABLE_DATABASE.PRODUCT} as p
      //                                    WHERE p.servicePackID = ?`,
      //   [payload.servicePackID]
      // );
      // if (!isEmpty(servicePack2DB)) {
      //   return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
      //     message: constant.RESPONSE_MESSAGE.ERROR_SERVICE_PACK_EXIT,
      //   });
      // }

      let userDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.userID = ?`,
        [payload.userID]
      );
      if (isEmpty(userDB)) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          message: constant.RESPONSE_MESSAGE.ERROR_USER_NOT_EXIT,
        });
      }

      await querySQl(
        `INSERT INTO ${constant.TABLE_DATABASE.PRODUCT} (productID, servicePackID, userID, status, createdBy)
                            VALUES (?, ?, ?, ?, ?)`,
        [
          productID,
          payload.servicePackID,
          payload.userID,
          PRODUCT_STATUS.DRAFT,
          payload.createdBy,
        ]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
        data: { productID: productID },
      });
    } catch (err) {
      console.error('Error executing query create product :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR });
    }
  },

  svUpdate: async (req, res) => {
    const payload = req.body;
    const historyID = uuidv4();

    const schema = Joi.object({
      productID: Joi.string().required(),
      status: Joi.string().required(),
      servicePackID: Joi.string().required(),
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
      let productDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.PRODUCT} as p
                                         ORDER BY totalExpiration DESC`,
        []
      );
      if (isEmpty(productDB)) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          message: constant.RESPONSE_MESSAGE.ERROR_PRODUCT_NOT_FOUND,
        });
      }

      let servicePackInProductDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.PRODUCT} as p
                                         WHERE p.servicePackID = ? AND p.status = ? AND p.productID <> ?`,
        [
          payload.servicePackID,
          constant.PRODUCT_STATUS.PENDING,
          payload.productID,
        ]
      );

      if (
        servicePackInProductDB.length > 0 &&
        payload.status === constant.PRODUCT_STATUS.PAID
      ) {
        let servicePackDB = await querySQl(
          `SELECT *
                                           FROM ${constant.TABLE_DATABASE.SERVICE_PACK} as s
                                           WHERE s.servicePackID = ?`,
          [payload.servicePackID]
        );
        let productDB = await querySQl(
          `SELECT *
                                           FROM ${constant.TABLE_DATABASE.PRODUCT} as p
                                           WHERE p.productID = ?`,
          [payload.productID]
        );

        if (productDB[0].totalExpiration === 0) {
          await querySQl(
            `UPDATE ${constant.TABLE_DATABASE.PRODUCT}
                                SET status = ?,
                                    totalExpiration = ?,
                                    updatedBy = ?
                                WHERE productID = ?`,
            [
              payload.status,
              Number(productDB[0].totalExpiration) +
                Number(servicePackDB[0].expirationDate),
              payload.updatedBy,
              productDB[0].productID,
            ]
          );
        } else {
          await querySQl(
            `UPDATE ${constant.TABLE_DATABASE.PRODUCT}
                                SET status = ?,
                                    totalExpiration = ?,
                                    updatedAt = ?
                                WHERE productID = ?`,
            [
              payload.status,
              Number(productDB[0].totalExpiration) +
                Number(servicePackDB[0].expirationDate),
              productDB[0].updatedAt,
              productDB[0].productID,
            ]
          );
        }

        await querySQl(
          `DELETE FROM ${constant.TABLE_DATABASE.PRODUCT} as p
                              WHERE p.productID = ?`,
          [servicePackInProductDB[0].productID]
        );

        await querySQl(
          `INSERT INTO ${constant.TABLE_DATABASE.HISTORY} (historyID, servicePackID, status, createdBy)
                                VALUES (?, ?, ?, ?)`,
          [
            historyID,
            payload.servicePackID,
            constant.PRODUCT_STATUS.PAID,
            payload.updatedBy,
          ]
        );
      } else {
        await querySQl(
          `UPDATE ${constant.TABLE_DATABASE.PRODUCT}
                                SET status = ?,
                                    updatedBy = ?
                                WHERE productID = ?`,
          [payload.status, payload.updatedBy, payload.productID]
        );
      }

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
      productID: Joi.string().required(),
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
      let productDB = await querySQl(
        `SELECT *
                                         FROM ${constant.TABLE_DATABASE.PRODUCT} as p
                                         WHERE p.productID = ?`,
        [payload.productID]
      );
      if (isEmpty(productDB)) {
        return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
          message: constant.RESPONSE_MESSAGE.ERROR_PRODUCT_NOT_FOUND,
        });
      }

      await querySQl(
        `DELETE FROM ${constant.TABLE_DATABASE.PRODUCT} as p
                            WHERE p.productID = ?`,
        [payload.productID]
      );

      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE,
      });
    } catch (err) {
      console.error('Error executing query delete product by id :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
        });
    }
  },
  svGetAll: async (req, res) => {
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

    let sql = `SELECT p.*, u.username, u.email, s.servicePackName, s.image, s.price, s.promotion, s.content, s.expirationDate
                                      FROM ${constant.TABLE_DATABASE.PRODUCT} AS p
                                        LEFT JOIN ${constant.TABLE_DATABASE.SERVICE_PACK} AS s
                                                  ON s.servicePackID = p.servicePackID
                                        LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                                  ON u.userID = p.userID`;

    const conditions = [];
    const params = [];

    if (!isEmpty(payload.userID)) {
      conditions.push('p.userID = ?');
      params.push(payload.userID);
    }

    if (!isEmpty(payload.status)) {
      conditions.push('p.status = ?');
      params.push(payload.status);
    }

    if (conditions.length > 0) {
      sql +=
        ' WHERE ' + conditions.join(' AND ') + ' ORDER BY p.updatedAt DESC';
    }
    try {
      let productDB = await querySQl(sql, params);
      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        data: productDB,
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
