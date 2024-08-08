const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const {isEmpty} = require('../core/func');

const companyService = {
    svCreate: async (req, res) => {
        const companyID = uuidv4();
        const payload = req.body;

        const schema = Joi.object({
            name: Joi.string().required(),
            introduce: Joi.string().allow(''),
            email: Joi.string().email().allow(''),
            phone: Joi.string().allow(''),
            province: Joi.string().allow(''),
            address: Joi.string().allow(''),
            field: Joi.string().allow(''),
            logo: Joi.string().allow(''),
            scale: Joi.number().allow(0),
            corporateTaxCode: Joi.string().required(),
            website: Joi.string().allow(''),
            status: Joi.string().required(),
            createdBy: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            let companyDB = await querySQl(
                `SELECT *
                 FROM ${constant.TABLE_DATABASE.COMPANY} as u
                 WHERE u.corporateTaxCode = ?`,
                [payload.corporateTaxCode]
            );
            if (!isEmpty(companyDB)) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    message:
                    constant.RESPONSE_MESSAGE.ERROR_CORPORATE_TAX_CODE_ALREADY_EXIT,
                });
            }

            await querySQl(
                `INSERT INTO ${constant.TABLE_DATABASE.COMPANY} (companyID, name, introduce, email,
                                                                 phone, province, address, field, logo,
                                                                 scale,
                                                                 corporateTaxCode, website, status,
                                                                 createdBy)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    companyID,
                    payload.name,
                    payload.introduce,
                    payload.email,
                    payload.phone,
                    payload.province,
                    payload.address,
                    payload.field,
                    payload.logo,
                    payload.scale,
                    payload.corporateTaxCode,
                    payload.website,
                    constant.SYSTEM_STATUS.ACTIVE,
                    payload.createdBy,
                ]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_CREATE,
                data: {companyID: companyID},
            });
        } catch (err) {
            console.error('Error executing query create company :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR});
        }
    },

    svUpdate: async (req, res) => {
        const payload = req.body;

        const schema = Joi.object({
            companyID: Joi.string().required(),
            name: Joi.string().required(),
            introduce: Joi.string().allow(''),
            email: Joi.string().email().allow(''),
            phone: Joi.string().allow(''),
            province: Joi.string().allow(''),
            address: Joi.string().allow(''),
            field: Joi.string().allow(''),
            logo: Joi.string().allow(''),
            scale: Joi.number().allow(0),
            corporateTaxCode: Joi.string().required(),
            website: Joi.string().allow(''),
            status: Joi.string().required(),
            updatedBy: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            let companyDB = await querySQl(
                `SELECT *
                 FROM ${constant.TABLE_DATABASE.COMPANY} as u
                 WHERE u.companyID = ?`,
                [payload.companyID]
            );

            if (isEmpty(companyDB)) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    message: constant.RESPONSE_MESSAGE.ERROR_COMPANY_NOT_EXIT,
                });
            }

            await querySQl(
                `UPDATE ${constant.TABLE_DATABASE.COMPANY}
                 SET name             = ?,
                     introduce        = ?,
                     email            = ?,
                     phone            = ?,
                     province         = ?,
                     address          = ?,
                     field            = ?,
                     logo             = ?,
                     scale            = ?,
                     corporateTaxCode = ?,
                     website          = ?,
                     status           = ?,
                     updatedBy        = ?
                 WHERE companyID = ?`,
                [
                    payload.name,
                    payload.introduce,
                    payload.email,
                    payload.phone,
                    payload.province,
                    payload.address,
                    payload.field,
                    payload.logo,
                    payload.scale,
                    payload.corporateTaxCode,
                    payload.website,
                    payload.status,
                    payload.updatedBy,
                    payload.companyID,
                ]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_UPDATE,
            });
        } catch (err) {
            console.error('Error executing query update company :', err.stack);
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
            companyID: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            await querySQl(
                `DELETE
                 FROM ${constant.TABLE_DATABASE.COMPANY} as c
                 WHERE c.companyID = ?`,
                [payload.companyID]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_DELETE,
            });
        } catch (err) {
            console.error('Error executing query delete company by id :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svLock: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            companyID: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            await querySQl(
                `UPDATE ${constant.TABLE_DATABASE.COMPANY} as c
                 SET c.status = ?
                 WHERE c.companyID = ?`,
                [constant.SYSTEM_STATUS.LOCK, payload.companyID]
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: constant.RESPONSE_MESSAGE.SUCCESS_LOCK,
            });
        } catch (err) {
            console.error('Error executing query lock company by id :', err.stack);
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
            let companyDB = await querySQl(`SELECT c.*
                                            FROM ${constant.TABLE_DATABASE.COMPANY} AS c
                                            WHERE c.status = '${constant.SYSTEM_STATUS.ACTIVE}'
                                               or c.status = '${constant.SYSTEM_STATUS.LOCK}'
                                            ORDER BY c.updatedAt DESC`);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: companyDB,
            });
        } catch (err) {
            console.error('Error executing query get all company :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetByID: async (req, res) => {
        const payload = req.body;
        const schema = Joi.object({
            companyID: Joi.string().required(),
            token: Joi.string().required(),
        });

        const {error} = schema.validate(payload);
        if (error) {
            return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                massage: error.details[0].message,
            });
        }

        try {
            let companyDB = await querySQl(`SELECT c.*
                                            FROM ${constant.TABLE_DATABASE.COMPANY} AS c
                                            WHERE c.status = '${constant.SYSTEM_STATUS.ACTIVE}'
                                              AND c.companyID = '${payload.companyID}'
                                            ORDER BY c.updatedAt DESC`);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: companyDB,
            });
        } catch (err) {
            console.error('Error executing query get by id company :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetAllHeader: async (req, res) => {
        try {
            let companyDB = await querySQl(`SELECT c.companyID,
                                                   c.name                 as companyName,
                                                   c.logo                 as companyLogo,
                                                   COUNT(r.recruitmentID) AS recruitmentCount
                                            FROM ${constant.TABLE_DATABASE.COMPANY} AS c
                                                     LEFT JOIN ${constant.TABLE_DATABASE.USER} AS u
                                                               ON u.companyID = c.companyID
                                                     LEFT JOIN ${constant.TABLE_DATABASE.RECRUITMENT} AS r
                                                               ON r.userID = u.userID
                                            WHERE c.status = '${constant.SYSTEM_STATUS.ACTIVE}'
                                              AND r.status = '${constant.RECRUITMENT.PUBLISHED}'
                                            GROUP BY c.companyID, c.name, c.logo
                                            ORDER BY c.logo DESC`);
            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                data: companyDB,
            });
        } catch (err) {
            console.error('Error executing query get all header company :', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    }
};

module.exports = companyService;
