const constant = require('../config/constant');
const {querySQl} = require('../core/repository');
const path = require("path");
const {isEmpty} = require("../core/func");
const {v4: uuidv4} = require('uuid');
const Joi = require('joi');

const storeService = {
    svUpload: async (req, res) => {
        try {
            const payload = req.body;

            const schema = Joi.object({
                userID: Joi.string().allow(''),
                companyID: Joi.string().allow('')
            });

            const {error} = schema.validate(payload);
            if (error) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST)
                    .json({
                        status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                        massage: error.details[0].message
                    });
            }

            if (!req.files) {
                return res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                    status: constant.SYSTEM_HTTP_STATUS.BAD_REQUEST,
                    message: constant.SYSTEM_HTTP_MESSAGE.ERROR_UPLOAD_FILE,
                });
            }

            const uploadedFiles = await Promise.all(req.files.map(async (file) => {
                try {
                    const fileID = uuidv4();
                    if (!isEmpty(payload.userID)) {
                        await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.FILE} (fileID, userID, fileName, fileType, filePath)
                                        VALUES (?, ?, ?, ?, ?)`, [fileID, payload.userID, file.filename, file.mimetype, file.path]);
                    } else if (!isEmpty(payload.companyID)) {
                        await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.FILE} (fileID, companyID, fileName, fileType, filePath)
                                        VALUES (?, ?, ?, ?, ?)`, [fileID, payload.companyID, file.filename, file.mimetype, file.path]);
                    } else {
                        await querySQl(`INSERT INTO ${constant.TABLE_DATABASE.FILE} (fileID, fileName, fileType, filePath)
                                        VALUES (?, ?, ?, ?)`, [fileID, file.filename, file.mimetype, file.path]);
                    }
                    return {
                        fileName: file.filename,
                        filePath: file.path,
                    };
                } catch (error) {
                    console.error('Error inserting file into database:', error);
                    return res.status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                        message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
                    });
                }
            }));

            return res.status(constant.SYSTEM_HTTP_STATUS.OK).json({
                status: constant.SYSTEM_HTTP_STATUS.OK,
                message: 'Files uploaded successfully',
                data: uploadedFiles,
            });
        } catch (err) {
            console.error('Error executing query upload:', err.stack);
            return res.status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    },
    svGetFile: async (req, res) => {
        try {
            const filename = req.params.filename;
            const filepath = path.join(__dirname, '../../uploads', filename);

            res.sendFile(filepath, (err) => {
                if (err) {
                    res.status(constant.SYSTEM_HTTP_STATUS.BAD_REQUEST).json({
                        status: constant.SYSTEM_HTTP_STATUS.NOT_FOUND,
                        message: constant.SYSTEM_HTTP_MESSAGE.ERROR_NOT_FOUND_FILE,
                    });
                }
            });
        } catch (err) {
            console.error('Error retrieving file:', err.stack);
            return res
                .status(constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    status: constant.SYSTEM_HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    message: constant.SYSTEM_HTTP_MESSAGE.INTERNAL_SERVER_ERROR
                });
        }
    },
};

module.exports = storeService;
