const setting = require('../config/constant');
const { query } = require('../core/repository');
const { isEmpty, isEmail, hashPassword } = require('../core/func');
const { v4: uuidv4 } = require('uuid');

const authService = {
  // login: async (req, res) => {
  //   const email = req.body.email;
  //   const password = req.body.password;
  //
  //   // Validate
  //   if (isEmpty(email) || isEmpty(password)) {
  //     return res.json(
  //       new HttpException(
  //         setting.SYSTEM_STATUS_CODE.BadRequest,
  //         setting.SYSTEM_STATUS_MESSAGE.BadRequest,
  //         []
  //       )
  //     );
  //   }
  //   if (isEmail(email)) {
  //     return res.json(
  //       new HttpException(
  //         setting.SYSTEM_STATUS_CODE.BadRequest,
  //         setting.RESPONSE_MESSAGE.INVALID_EMAIL_FORMAT,
  //         []
  //       )
  //     );
  //   }
  //
  //   try {
  //     await query(
  //       `SELECT *
  //                    FROM ${setting.TABLE_DATABASE.USER} as user
  //                    WHERE user._email = ? and user._password = ?`,
  //       [email, password]
  //     ).then((results) => {
  //       // if (isPassword(password, )) {
  //       //     return res.json(new HttpException(setting.SYSTEM_STATUS_CODE.BadRequest, setting.ERROR_MESSAGE.INVALID_EMAIL_FORMAT, []));
  //       // }
  //
  //       return res.json(
  //         new HttpException(
  //           setting.SYSTEM_STATUS_CODE.OK,
  //           setting.RESPONSE_MESSAGE.REGISTER_ACCOUNT_SUCCESS,
  //           {}
  //         )
  //       );
  //     });
  //   } catch (err) {
  //     console.error('Error executing query login :', err);
  //     return res.json(
  //       new HttpException(
  //         setting.SYSTEM_STATUS_CODE.BadRequest,
  //         setting.SYSTEM_STATUS_MESSAGE.BadRequest,
  //         {}
  //       )
  //     );
  //   }
  // },
};

module.exports = authService;
