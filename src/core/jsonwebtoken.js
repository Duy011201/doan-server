const jwt = require('jsonwebtoken');
const setting = require('../config/setting');

require('dotenv').config();
const secretKey = process.env.SECRET_TOKEN_KEY;
const expiresIn = process.env.EXPIRES_IN_TOKEN;

function generateToken(data) {
  return jwt.sign(data, secretKey, { expiresIn: expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log(error);
    throw new Error(setting.RESPONSE_MESSAGE.INVALID_TOKEN);
  }
}

function refreshToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    delete decoded?.exp;
    delete decoded?.iat;
    return generateToken(decoded);
  } catch (error) {
    console.log(error);
    throw new Error(setting.RESPONSE_MESSAGE.INVALID_TOKEN);
  }
}

module.exports = { generateToken, verifyToken, refreshToken };
