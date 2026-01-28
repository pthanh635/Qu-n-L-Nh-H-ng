/**
 * Global Error Handler Middleware
 * Xử lý tất cả errors từ controllers
 * QUAN TRỌNG: Phải là middleware cuối cùng được load
 */

module.exports = (err, req, res, next) => {
  console.error('❌ Error occurred:', {
    message: err.message,
    status: err.status || 500,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error status & message
  let status = err.status || 500;
  let message = err.message || 'Lỗi server nội bộ';

  // Xử lý các loại error khác nhau

  // 1. Validation Error từ Sequelize
  if (err.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Dữ liệu không hợp lệ';
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(status).json({
      success: false,
      message,
      errors
    });
  }

  // 2. Unique Constraint Error (duplicate key)
  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = 'Dữ liệu đã tồn tại';
    const errors = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} đã được sử dụng`,
      value: e.value
    }));
    return res.status(status).json({
      success: false,
      message,
      errors
    });
  }

  // 3. Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 400;
    message = 'Dữ liệu tham chiếu không tồn tại';
    return res.status(status).json({
      success: false,
      message,
      detail: err.message
    });
  }

  // 4. Database Connection Error
  if (err.name === 'SequelizeConnectionError') {
    status = 503;
    message = 'Không thể kết nối đến database';
    return res.status(status).json({
      success: false,
      message
    });
  }

  // 5. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Token không hợp lệ';
    return res.status(status).json({
      success: false,
      message
    });
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token đã hết hạn';
    return res.status(status).json({
      success: false,
      message,
      expiredAt: err.expiredAt
    });
  }

  // 6. Custom API Error
  if (err.isApiError) {
    return res.status(status).json({
      success: false,
      message,
      details: err.details
    });
  }

  // 7. Generic Error - Log stack trace in development
  if (process.env.NODE_ENV === 'development') {
    return res.status(status).json({
      success: false,
      message,
      stack: err.stack,
      error: err
    });
  }

  // Production - không reveal internal error details
  return res.status(status).json({
    success: false,
    message: status === 500 ? 'Lỗi server nội bộ' : message
  });
};
