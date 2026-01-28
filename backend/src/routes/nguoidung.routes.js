/**
 * Người Dùng Routes
 * CRUD operations cho người dùng
 * GET /usuarios - Lấy danh sách người dùng
 * GET /usuarios/:id - Lấy thông tin 1 người dùng
 * PUT /usuarios/:id - Cập nhật thông tin
 * DELETE /usuarios/:id - Xóa người dùng
 */

const express = require('express');
const router = express.Router();
const nguoidungController = require('../controllers/nguoidung.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication
 * IMPORTANT: Specific routes must come before dynamic /:id routes
 */

// Lấy danh sách nhân viên (admin or manager)
router.get('/staff/list', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  nguoidungController.getStaffList
);

// Lấy danh sách khách hàng (admin or staff)
router.get('/customers/list', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  nguoidungController.getCustomerList
);

// Lấy danh sách người dùng (admin only)
// Query: { page, limit, vaiTro, trangThai }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  nguoidungController.getAllUsers
);

// Lấy thông tin 1 người dùng
router.get('/:id', 
  authMiddleware, 
  nguoidungController.getUserById
);

// Cập nhật thông tin người dùng
// Body: { Ten, Email, TrangThai (admin only), VaiTro (admin only) }
router.put('/:id', 
  authMiddleware, 
  nguoidungController.updateUser
);

// Xóa người dùng (admin only)
router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  nguoidungController.deleteUser
);

module.exports = router;
