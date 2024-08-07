const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const path = require('path');
const {isEmpty, filterFields} = require('../core/func');
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');
const fs = require('fs');

const storeService = {
    svUpload: async (req, res) => {
        try {
            const payload = req.body;

            const schema = Joi.object({
                userID: Joi.string().allow(''),
                companyID: Joi.string().allow(''),
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    massage: error.details[0].message,
                });
            }

            if (!req.files) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    message: constant.SYSTEM_HTTP_MESSAGE.ERROR_UPLOAD_FILE,
                });
            }

            const uploadedFiles = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const fileID = uuidv4();
                        if (!isEmpty(payload.userID)) {
                            await querySQl(
                                `INSERT INTO ${constant.TABLE_DATABASE.FILE} (fileID, userID, fileName, fileType, filePath)
                                 VALUES (?, ?, ?, ?, ?)`,
                                [
                                    fileID,
                                    payload.userID,
                                    file.filename,
                                    file.mimetype,
                                    file.path,
                                ]
                            );
                        } else if (!isEmpty(payload.companyID)) {
                            await querySQl(
                                `INSERT INTO ${constant.TABLE_DATABASE.FILE} (fileID, companyID, fileName, fileType, filePath)
                                 VALUES (?, ?, ?, ?, ?)`,
                                [
                                    fileID,
                                    payload.companyID,
                                    file.filename,
                                    file.mimetype,
                                    file.path,
                                ]
                            );
                        } else {
                            await querySQl(
                                `INSERT INTO ${constant.TABLE_DATABASE.FILE} (fileID, fileName, fileType, filePath)
                                 VALUES (?, ?, ?, ?)`,
                                [fileID, file.filename, file.mimetype, file.path]
                            );
                        }
                        return {
                            fileName: file.filename,
                            filePath: file.path,
                        };
                    } catch (error) {
                        console.error('Error inserting file into database:', error);
                        return res
                            .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                            .json({
                                status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                                message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                            });
                    }
                })
            );

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: 'Files uploaded successfully',
                data: uploadedFiles,
            });
        } catch (err) {
            console.error('Error executing query upload:', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetFile: async (req, res) => {
        try {

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: 'Files uploaded successfully',
                data: uploadedFiles,
            });
        } catch (err) {
            console.error('Error executing query upload:', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetFile: async (req, res) => {
        try {
            const fileDB = await querySQl(
                `SELECT *
                 FROM ${constant.TABLE_DATABASE.FILE} AS f
                 WHERE f.fileName LIKE '%${req.params.filename.replace('uploads\\', '')}%'`,
            );
            const filepath = path.join(__dirname, '../../uploads', fileDB[0].fileName);
            const pdfBuffer = fs.readFileSync(filepath);
            const base64PDF = pdfBuffer.toString('base64');

            let fileRes = {
                fileType: fileDB[0]?.fileType,
                fileName: fileDB[0]?.fileName,
                base64: base64PDF
            }
            // res.sendFile(filepath, (err) => {
            //         if (err) {
            //             res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
            //                 status: constant.SYSTEM_HTTP_STATUS.NOT_FOUND,
            //                 message: constant.SYSTEM_HTTP_MESSAGE.ERROR_NOT_FOUND_FILE,
            //             })
            //         }
            //     }
            // )

            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    data: fileRes
                });
        } catch (err) {
            console.error('Error get file:', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
    svGetManyFile: async (req, res) => {
        try {
            const getFiles = await Promise.all(
                req.body.map(async (file) => {
                    try {
                        const fileDB = await querySQl(
                            `SELECT * FROM ${constant.TABLE_DATABASE.FILE} AS f WHERE f.fileName LIKE '%${file.fileName.replace('uploads\\', '')}%'`,
                        );
                        const filepath = path.join(__dirname, '../../uploads', fileDB[0].fileName);
                        const pdfBuffer = fs.readFileSync(filepath);
                        const base64PDF = pdfBuffer.toString('base64');
                        return {
                            fileType: fileDB[0]?.fileType,
                            fileName: fileDB[0]?.fileName,
                            fileBase64: base64PDF
                        };
                    } catch (error) {
                        console.error('Error get many file:', error);
                        return res
                            .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                            .json({
                                status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                                message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                            });
                    }
                }))
            return res
                .status(constant.SYSTEM_HTTP_STATUS.OK)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.OK,
                    data: getFiles
                });
        } catch (err) {
            console.error('Error retrieving file:', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                });
        }
    },
};

module.exports = storeService;
