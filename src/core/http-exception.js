class HttpException {
    constructor(statusCode, statusMessage, data) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
    }
}

module.exports = HttpException;