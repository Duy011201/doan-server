const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const path = require("path");
const {isEmpty} = require("../core/func");
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');
const {sendEmail} = require("../common/nodemailer");

const notificationService = {
    svSendContentEmail: async (req, res) => {
        try {
            const payload = req.body;

            const schema = Joi.object({
                userID: Joi.string().allow(''),
                role: Joi.string().allow(''),
                content: Joi.string().required(),
                token: Joi.string().required()
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        massage: error.details[0].message
                    });
            }

            let userDB;

            if (payload.userID) {
                userDB = await querySQl(`SELECT u.email
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                         WHERE u.userID = ?`, [payload.userID]);
            } else {
                userDB = await querySQl(`SELECT u.email
                                         FROM ${constant.TABLE_DATABASE.USER} as u
                                                  JOIN ${constant.TABLE_DATABASE.USER_ROLE} ur
                                                       ON ur.userID = u.userID
                                                  JOIN ${constant.TABLE_DATABASE.ROLE} r
                                                       ON ur.roleID = r.roleID
                                         WHERE r.name = ?`, [payload.role]);
            }

            await Promise.all(userDB.map(async (user) => {
                await sendEmail(user.email, process.env.SERVER_NAME, `${payload.text}`)
            }))

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_SEND_EMAIL,
            });
        } catch (err) {
            console.error(`Error notification for role : ${payload.role}`, error);
            return res.status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    },
};

module.exports = notificationService;
