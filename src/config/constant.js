const constant = {
  TABLE_DATABASE: {
    USER: 'user',
    ROLE: 'role',
    USER_ROLE: 'user_role',
    COMPANY: 'company',
    VERIFY_CODE: 'verify_code',
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
    SERVICE_UNAVAILABLE: 503
  },
  SYSTEM_STATUS_MESSAGE: {
    OK: 'OK',
    CREATED: 'Created',
    NO_CONTENT: 'No Content',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    SERVICE_UNAVAILABLE: 'Service Unavailable',
  },
  SYSTEM_ROLE: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    CANDIDATE: 'candidate',
    EMPLOYER: 'employer',
  },
  SYSTEM_ROLE_DESC: {
    SUPPER_ADMIN: 'Quản trị toàn bộ hệ thống',
    ADMIN: 'Quản trị nhà tuyển dụng và ứng viên',
    CANDIDATE: 'Ứng viên',
    EMPLOYER: 'Nhà tuển dụng',
  },
  SYSTEM_STATUS: {
    ACTIVE: 'active',
    IN_ACTIVE: 'inactive',
    LOCK: 'lock',
  },
  SQL_METHOD: {
    GET: 'get',
    DELETE: 'delete',
    INSERT: 'insert',
    UPDATE: 'update',
  },
  RESPONSE_MESSAGE: {
    SUCCESS_REGISTER_ACCOUNT: 'Đăng ký tài khoản thành công',
    SUCCESS_LOGIN_ACCOUNT: 'Đăng nhập tài khoản thành công',
    SUCCESS_SEND_VERIFY_CODE: 'Gửi mã xác thực thành công',
    SUCCESS_FORGOT_PASSWORD: 'Đổi mật khẩu thành công',
    SUCCESS_REFRESH_TOKEN: 'Lấy token mới thành công',
    SUCCESS_CREATE: 'Tạo thành công',
    SUCCESS_DELETE: 'Xóa thành công',
    SUCCESS_RESET_PASSWORD: 'Đặt lại mật khẩu thành công',

    INCORRECT_EMAIL_OR_PASSWORD: 'Tài khoản hoặc mật khẩu không chính xác',
    INVALID_EMAIL_FORMAT: 'Định dạng email không hợp lệ',
    INVALID_PASSWORD_FORMAT: 'Định dạng passwword không hợp lệ',
    INVALID_TOKEN: 'Định dạng token không hợp lệ',
    INVALID_ENCRYPTION_AUTHENTICATION: 'Mã xác thực không hợp lệ',
    INVALID_COMPANY_NAME: 'Tên công ty không hợp lệ',
    INVALID_COMPANY_CORPORATE_TAX_CODE: 'Mã số thuế không hợp lệ',

    ERROR_COMPANY_CORPORATE_TAX_CODE_EXIT: 'Mã số thuế đã được đăng ký',
    ERROR_REGISTER_ACCOUNT: 'Lỗi đăng ký tài khoản',
    ERROR_FORGOT_PASSWORD: 'Lỗi lấy lại mật khẩu',
    ERROR_NOT_EXIT: 'Lỗi tài khoản không tồn tại',
    ERROR_LOCK_ACCOUNT: 'Lỗi tài khoản đã bị khóa',
    ERROR_EXPIRED_VERIFY_CODE: 'Lỗi mã xác thực hết hạn',
    ERROR_ENCRYPTION_VERIFY_CODE: 'Lỗi mã xác thực không đúng',
    ERROR_EXPIRED_TOKEN: 'Lỗi mã xác thực hết hạn',
    ERROR_EMAIL_ALREADY_EXIT: 'Lỗi email đã tồn tại',
    ERROR_USER_NOT_EXIT: 'Lỗi người dùng không tồn tại',
    ERROR_COMPANY_NOT_EXIT: 'Lỗi công ty không tồn tại',
    ERROR_ENCODE: 'Lỗi mã hóa mật khẩu',
    ERROR_ROLE: 'Lỗi quyền',
  },
};

module.exports = constant;
