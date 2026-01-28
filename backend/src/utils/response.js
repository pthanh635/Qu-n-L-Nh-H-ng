/**
 * Response Helper Utility
 * Định dạng response JSON chuẩn cho tất cả API
 */

/**
 * Success Response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Response message
 * @param {Object} data - Response data (optional)
 */
function sendSuccess(res, statusCode = 200, message = 'Thành công', data = null) {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
}

/**
 * Error Response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} message - Error message
 * @param {Object} errors - Error details (optional)
 */
function sendError(res, statusCode = 400, message = 'Lỗi', errors = null) {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
}

/**
 * Paginated Response
 * @param {Object} res - Express response object
 * @param {Array} data - Data array
 * @param {number} total - Total items count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Success message
 */
function sendPaginated(res, data = [], total = 0, page = 1, limit = 10, message = 'Lấy dữ liệu thành công') {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
}

/**
 * Created Response (201)
 * @param {Object} res - Express response object
 * @param {Object} data - Created resource data
 * @param {string} message - Success message
 */
function sendCreated(res, data, message = 'Tạo mới thành công') {
  return sendSuccess(res, 201, message, data);
}

/**
 * Not Found Response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function sendNotFound(res, message = 'Không tìm thấy') {
  return sendError(res, 404, message);
}

/**
 * Unauthorized Response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function sendUnauthorized(res, message = 'Không được phép') {
  return sendError(res, 401, message);
}

/**
 * Forbidden Response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function sendForbidden(res, message = 'Cấm truy cập') {
  return sendError(res, 403, message);
}

/**
 * Validation Error Response (400)
 * @param {Object} res - Express response object
 * @param {Array|Object} errors - Validation errors
 * @param {string} message - Error message
 */
function sendValidationError(res, errors = {}, message = 'Dữ liệu không hợp lệ') {
  return sendError(res, 400, message, errors);
}

/**
 * Server Error Response (500)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {string} error - Error details (development only)
 */
function sendServerError(res, message = 'Lỗi server nội bộ', error = null) {
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error })
  };

  return res.status(500).json(response);
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendValidationError,
  sendServerError
};
