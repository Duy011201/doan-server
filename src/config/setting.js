const setting = {
  TABLE_DATABASE: {
    USER: "user",
    ROLE: "role",
    COMPANY: "company",
    VERIFY_CODE: "verify_code",
  },
  SYSTEM_STATUS_CODE: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  SYSTEM_STATUS_MESSAGE: {
    OK: "OK",
    CREATED: "Created",
    NO_CONTENT: "No Content",
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    SERVICE_UNAVAILABLE: "Service Unavailable",
  },
  SYSTEM_ROLE: {
    ADMIN: "admin",
    CANDIDATE: "candidate",
    EMPLOYER: "employer",
    HEAD: "head",
  },
  SYSTEM_STATUS: {
    ACTIVE: "active",
    IN_ACTIVE: "inactive",
    LOOK: "lock",
  },
  SQL_METHOD: {
    GET: "get",
    DELETE: "delete",
    INSERT: "insert",
    UPDATE: "update",
  },
  RESPONSE_MESSAGE: {
    SUCCESS_REGISTER_ACCOUNT: "Đăng ký tài khoản thành công",
    SUCCESS_LOGIN_ACCOUNT: "Đăng nhập tài khoản thành công",
    SUCCESS_SEND_VERIFY_CODE: "Gửi mã xác thực thành công",
    SUCCESS_FORGOT_PASSWORD: "Lấy lại mật khẩu thành công",
    SUCCESS_REFRESH_TOKEN: "Lấy token mới thành công",

    INCORRECT_EMAIL_OR_PASSWORD: "Tài khoản hoặc mật khẩu không chính xác",
    INVALID_EMAIL_FORMAT: "Định dạng email không hợp lệ",
    INVALID_PASSWORD_FORMAT: "Định dạng passwword không hợp lệ",
    INVALID_TOKEN: "Định dạng token không hợp lệ",

    ERROR_REGISTER_ACCOUNT: "Lỗi đăng ký tài khoản",
    ERROR_FORGOT_PASSWORD: "Lỗi lấy lại mật khẩu",
    ERROR_NOT_EXIT_OR_LOCK_ACCOUNT:
      "Lỗi tài khoản không tồn tại hoặc đã bị khóa",
    ERROR_EXIT_ANY_ACCOUNT: "Lỗi tồn tại nhiều hơn 1 tài khoản",
    ERROR_EXPIRED_VERIFY_CODE: "Lỗi mã xác thực hết hạn",
    ERROR_EXPIRED_TOKEN: "Lỗi mã xác thực hết hạn",
    ERROR_EMAIL_ALREADY_EXIT: "Lỗi email đã tồn tại",
    ERROR_ENCODE: "Lỗi mã hóa mật khẩu",
    ERROR_ROLE: "Lỗi quyền",
  },
};

module.exports = setting;
