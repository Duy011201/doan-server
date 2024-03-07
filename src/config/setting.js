const setting = {
    TABLE_DATABASE: {
        USER: 'user',
        ROLE: 'role',
        COMPANY: 'company',
        VERIFY_CODE: 'verify_code',
    },
    SYSTEM_STATUS_CODE: {
        OK: 200,
        Created: 201,
        NoContent: 204,
        BadRequest: 400,
        Unauthorized: 401,
        Forbidden: 403,
        NotFound: 404,
        InternalServerError: 500,
        ServiceUnavailable: 503,
    },
    SYSTEM_STATUS_MESSAGE: {
        OK: "OK",
        Created: "Created",
        NoContent: "No Content",
        BadRequest: "Bad Request",
        Unauthorized: "Unauthorized",
        Forbidden: "Forbidden",
        NotFound: "Not Found",
        InternalServerError: "Internal Server Error",
        ServiceUnavailable: "Service Unavailable",
    },
    SYSTEM_ROLE: {
        ADMIN: 'admin',
        CANDIDATE: 'Candidate',
        EMPLOYER: 'employer'
    },
    SYSTEM_STATUS: {
        ACTIVE: 'active',
        IN_ACTIVE: 'inactive',
        LOCK: 'lock'
    },
    RESPONSE_MESSAGE: {
        SUCCESS_REGISTER_ACCOUNT: 'Đăng ký tài khoản thành công',
        SUCCESS_LOGIN_ACCOUNT: 'Đăng nhập tài khoản thành công',
        SUCCESS_SEND_VERIFY_CODE: 'Gửi mã xác thực thành công',
        SUCCESS_FORGOT_PASSWORD: 'Lấy lại mật khẩu thành công',

        INCORRECT_EMAIL_OR_PASSWORD: 'Tài khoản hoặc mật khẩu không chính xác',
        INVALID_EMAIL_FORMAT: 'Định dạng email không hợp lệ',

        ERROR_REGISTER_ACCOUNT: 'Lỗi đăng ký tài khoản',
        ERROR_FORGOT_PASSWORD: 'Lỗi lấy lại mật khẩu',
        ERROR_NOT_EXIT_OR_LOCK_ACCOUNT: 'Lỗi tài khoản không tồn tại hoặc đã bị khóa',
        ERROR_EXPIRED_VERIFY_CODE: 'Lỗi mã xác thực hết hạn',
        ERROR_EMAIL_ALREADY_EXIT: 'Lỗi email đã tồn tại',
        ERROR_ENCODE: 'Lỗi Mã hóa mật khẩu'
    }
}

module.exports = setting;