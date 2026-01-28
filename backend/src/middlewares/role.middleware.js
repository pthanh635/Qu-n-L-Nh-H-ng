/**
 * Middleware kiểm tra Role-Based Access Control (RBAC)
 * Kiểm tra xem user có role phù hợp không
 * 
 * Cách sử dụng:
 * router.post('/admin', roleMiddleware(['admin']), controller);
 * router.get('/staff', roleMiddleware(['admin', 'nhanvien']), controller);
 */

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Kiểm tra user đã được authenticate (auth.middleware phải chạy trước)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập để tiếp tục'
        });
      }

      // Nếu không có roles được specify, cho phép tất cả
      if (!allowedRoles || allowedRoles.length === 0) {
        return next();
      }

      // Kiểm tra user có role trong danh sách allowedRoles không
      const userRole = req.user.VaiTro || req.user.vaiTro;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Bạn không có quyền truy cập. Yêu cầu roles: ${allowedRoles.join(', ')}`,
          requiredRoles: allowedRoles,
          userRole: userRole
        });
      }

      next();
    } catch (error) {
      console.error('❌ Role Check Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra quyền'
      });
    }
  };
};
