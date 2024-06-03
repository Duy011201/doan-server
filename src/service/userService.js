const setting = require('../config/constant');
const { querySQl, performSQL } = require('../core/repository');
const {
  isEmpty,
  isEmail,
  bcryptComparePassword,
  bcryptHashPassword,
  generateRandomVerifyCode,
  timeDiff,
  filterFields,
} = require('../core/func');
const { refreshToken, generateToken } = require('../common/jsonwebtoken');
const { sendEmail } = require('../common/nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const authService = {
  svCreate: async (req, res) => {
    const { email, password, role, createdBy } = req.body;
    const updatedBy = 'system';
    const userID = uuidv4();
    const roleID = uuidv4();

    // Validate request parameters
    if (isEmpty(password) || !isEmail(email) || isEmpty(role)) {
      return res
        .status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST)
        .json({ message: setting.SYSTEM_STATUS_MESSAGE.BAD_REQUEST });
    }

    try {
      let users = await performSQL(
        setting.SQL_METHOD.GET,
        setting.TABLE_DATABASE.USER,
        [{ _email: email }]
      );

      if (!isEmpty(users)) {
        return res
          .status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST)
          .json({ message: setting.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT });
      }

      let hashPassword = await bcryptHashPassword(password);

      await querySQl(
        `INSERT INTO ${setting.TABLE_DATABASE.USER} (_userID, _email, _password, _status, _createdBy, _updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userID,
          email,
          hashPassword,
          setting.SYSTEM_STATUS.ACTIVE,
          createdBy,
          updatedBy,
        ]
      );

      await querySQl(
        `INSERT INTO ${setting.TABLE_DATABASE.ROLE} (_roleID, _userID, _name, _createdBy, _updatedBy)
                                VALUES (?, ?, ?, ?, ?)`,
        [roleID, userID, role, createdBy, updatedBy]
      );

      return res.status(setting.SYSTEM_STATUS_CODE.OK).json({
        message: setting.RESPONSE_MESSAGE.SUCCESS_CREATE,
        data: { userID: userID },
      });
    } catch (err) {
      console.error('Error executing query create user :', err.stack);
      return res
        .status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR });
    }
  },
  svUpdate: async (req, res) => {
    const payload = req.body;

    //   _userID: this.dataDialog._userID,
    //   _companyID: this.dataDialog._companyID,
    //   _username: this.dataDialog._username,
    //   _email: this.dataDialog._email,
    //   _password: this.dataDialog._password,
    //   _phone: this.dataDialog._phone,
    //   _avatar: this.dataDialog._avatar,
    //   _status: this.statusOption.key,
    //   _createdAt: this.dataDialog._createdAt,
    //   _updatedAt: new Date().toISOString(),
    //   _createdBy: this.dataDialog._createdBy,
    //   _updatedBy: getFromLocalStorage('userID'),
    //   _role: this.dataDialog._role.key,

    // Validate request parameters
    if (
      isEmpty(payload.role) ||
      isEmpty(payload.userID) ||
      !isEmail(payload.email) ||
      !isPhone(payload.status)
    ) {
      return res
        .status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST)
        .json({ message: setting.SYSTEM_STATUS_MESSAGE.BAD_REQUEST });
    }

    try {
      let users = await performSQL(
        setting.SQL_METHOD.GET,
        setting.TABLE_DATABASE.USER,
        [{ _userID: payload.userID }]
      );

      if (!isEmpty(users)) {
        return res
          .status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST)
          .json({ message: setting.RESPONSE_MESSAGE.ERROR_EMAIL_ALREADY_EXIT });
      }

      const verifyCodeDB = await performSQL(
        setting.SQL_METHOD.GET,
        setting.TABLE_DATABASE.VERIFY_CODE,
        [{ _email: email }]
      );

      // Default one day
      if (
        isEmpty(verifyCodeDB) ||
        verifyCodeDB[0]['_status'] !== setting.SYSTEM_STATUS.ACTIVE ||
        (timeDiff(today, verifyCodeDB[0]['_updatedAt'], 1) &&
          verifyCodeDB[0]['_code'] !== verifyCode)
      ) {
        return res.status(setting.SYSTEM_STATUS_CODE.BAD_REQUEST).json({
          message: setting.RESPONSE_MESSAGE.INVALID_ENCRYPTION_AUTHENTICATION,
        });
      }

      if (!isEmpty(role) && !isEmpty(desc)) {
        let hashPassword = await bcryptHashPassword(password);

        await querySQl(
          `INSERT INTO ${setting.TABLE_DATABASE.USER} (_userID, _email, _password, _status, _createdBy, _updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userID,
            email,
            hashPassword,
            setting.SYSTEM_STATUS.ACTIVE,
            createdBy,
            updatedBy,
          ]
        );

        await querySQl(
          `INSERT INTO ${setting.TABLE_DATABASE.ROLE} (_roleID, _userID, _ name, _ desc, _createdBy, _updatedBy)
                                VALUES (?, ?, ?, ?, ?, ?)`,
          [roleID, userID, role, desc, createdBy, updatedBy]
        );

        await performSQL(
          setting.SQL_METHOD.UPDATE,
          setting.TABLE_DATABASE.VERIFY_CODE,
          [
            { _status: setting.SYSTEM_STATUS.IN_ACTIVE },
            { _verifyCodeID: verifyCodeDB[0]['_verifyCodeID'] },
          ]
        );

        return res.status(setting.SYSTEM_STATUS_CODE.OK).json({
          message: setting.RESPONSE_MESSAGE.SUCCESS_REGISTER_ACCOUNT,
          data: { userID: userID },
        });
      }

      return res
        .status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: setting.RESPONSE_MESSAGE.ERROR_REGISTER_ACCOUNT });
    } catch (err) {
      console.error('Error executing query register :', err.stack);
      return res
        .status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR });
    }
  },
  svDelete: async (req, res) => {
    const userID = req.body.userID;
    try {
      await performSQL(setting.SQL_METHOD.DELETE, setting.TABLE_DATABASE.USER, [
        { _userID: userID },
      ]);
      await performSQL(setting.SQL_METHOD.DELETE, setting.TABLE_DATABASE.ROLE, [
        { _userID: userID },
      ]);
      return res
        .status(setting.SYSTEM_STATUS_CODE.OK)
        .json({ message: setting.RESPONSE_MESSAGE.SUCCESS_DELETE });
    } catch (err) {
      console.error('Error executing query delete user by id :', err.stack);
      return res
        .status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR });
    }
  },

  svGetAll: async (req, res) => {
    try {
      let userDB =
        await querySQl(`SELECT user.* , role._name as _role FROM ${setting.TABLE_DATABASE.USER} AS user  
                LEFT JOIN ${setting.TABLE_DATABASE.ROLE} AS role ON user._userID = role._userID;`);
      return res.status(setting.SYSTEM_STATUS_CODE.OK).json({ data: userDB });
    } catch (err) {
      console.error('Error executing query get all user :', err.stack);
      return res
        .status(setting.SYSTEM_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: setting.SYSTEM_STATUS_MESSAGE.INTERNAL_SERVER_ERROR });
    }
  },
};

module.exports = authService;
