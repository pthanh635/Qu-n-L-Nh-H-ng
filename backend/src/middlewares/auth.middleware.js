/**
 * Middleware xác thực JWT Token
 * Kiểm tra token có hợp lệ không
 * Nếu hợp lệ, set req.user = decoded token data
 */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Lấy token từ header Authorization: Bearer <token>
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token. Vui lòng đăng nhập'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'restaurant_secret_key');

    // Attach user info vào request object
    req.user = decoded;

    next();
  } catch (error) {
    // Token hết hạn
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại',
        expiredAt: error.expiredAt
      });
    }

    // Token không hợp lệ
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    // Lỗi khác
    console.error('❌ Auth Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  }
};
