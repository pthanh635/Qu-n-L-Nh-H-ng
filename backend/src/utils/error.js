/**
 * Custom API Error Class
 * Sử dụng để throw errors từ services & controllers
 */

class ApiError extends Error {
  constructor(statusCode = 500, message = 'Lỗi server', details = null) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
    this.isApiError = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Bad Request Error (400)
   */
  static badRequest(message = 'Yêu cầu không hợp lệ', details = null) {
    return new ApiError(400, message, details);
  }

  /**
   * Unauthorized Error (401)
   */
  static unauthorized(message = 'Không được xác thực', details = null) {
    return new ApiError(401, message, details);
  }

  /**
   * Forbidden Error (403)
   */
  static forbidden(message = 'Cấm truy cập', details = null) {
    return new ApiError(403, message, details);
  }

  /**
   * Not Found Error (404)
   */
  static notFound(message = 'Không tìm thấy', details = null) {
    return new ApiError(404, message, details);
  }

  /**
   * Conflict Error (409)
   */
  static conflict(message = 'Xung đột dữ liệu', details = null) {
    return new ApiError(409, message, details);
  }

  /**
   * Validation Error (400)
   */
  static validationError(message = 'Dữ liệu không hợp lệ', errors = {}) {
    return new ApiError(400, message, errors);
  }

  /**
   * Server Error (500)
   */
  static serverError(message = 'Lỗi server nội bộ', details = null) {
    return new ApiError(500, message, details);
  }

  /**
   * Custom Error
   */
  static custom(statusCode = 400, message = 'Lỗi', details = null) {
    return new ApiError(statusCode, message, details);
  }
}

module.exports = ApiError;
