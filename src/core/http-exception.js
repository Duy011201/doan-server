class HttpException {
    constructor(statusCode, statusMessage, data, token, refreshToken) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

module.exports = HttpException;