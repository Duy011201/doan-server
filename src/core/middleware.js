const constant = require('../config/constant');
const { verifyToken } = require('../common/jsonwebtoken');

require('dotenv').config();

function middlewareAuth(req, res, next) {
  if (req.url.includes('/auth')) {
    return next();
  }

  let token = undefined;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.body && req.body.token) {
    token = req.body.token;
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res
      .status(constant.SYSTEM_STATUS_CODE.UNAUTHORIZED)
      .json({ message: constant.SYSTEM_STATUS_MESSAGE.UNAUTHORIZED });
  }

  try {
    req.user = verifyToken(token);

    // const isAdmin = Array.isArray(req.user.roles) && req.user.roles.some(role => {
    //   return role.name === constant.SYSTEM_ROLE.ADMIN ||
    //       role.name === constant.SYSTEM_ROLE.SUPER_ADMIN;
    // })

    // if (req.url.includes('/admin') && isAdmin) {
    //   req.body.token = token;
    //   next();
    // } else {
    //   return res
    //       .status(constant.SYSTEM_STATUS_CODE.UNAUTHORIZED)
    //       .json({ message: constant.SYSTEM_STATUS_MESSAGE.UNAUTHORIZED });
    // }

    req.body.token = token;
    next();
  } catch (err) {
    res
      .status(constant.SYSTEM_STATUS_CODE.BAD_REQUEST)
      .json({ message: constant.SYSTEM_STATUS_MESSAGE.INVALID_TOKEN });
  }
}

module.exports = { middlewareAuth };
