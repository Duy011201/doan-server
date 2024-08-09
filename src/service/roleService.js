const constant = require('../config/constant');
const { querySQl } = require('../core/repository');

const authService = {
  svGetAll: async (req, res) => {
    const payload = req.body;

    const schema = Joi.object({
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
      let roleDB = await querySQl(`SELECT r.roleID, r.name as roleName
                                FROM ${constant.TABLE_DATABASE.ROLE} AS r`);
      return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
        status: constant.SYSTEM_HTTP_STATUS.OK,
        data: roleDB,
      });
    } catch (err) {
      console.error('Error executing query get all role :', err.stack);
      return res
        .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
        });
    }
  },
};

module.exports = authService;
