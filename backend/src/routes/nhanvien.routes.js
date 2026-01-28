/**
 * Nhân Viên Routes
 * CRUD operations cho nhân viên
 * GET /nhanvien - Lấy danh sách nhân viên
 * GET /nhanvien/:id - Lấy thông tin 1 nhân viên
 * POST /nhanvien - Tạo nhân viên mới
 * PUT /nhanvien/:id - Cập nhật thông tin
 * DELETE /nhanvien/:id - Xóa nhân viên
 */

const express = require('express');
const router = express.Router();
const nhanvienController = require('../controllers/nhanvien.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication & authorization
 */

// Lấy danh sách nhân viên hoạt động
router.get('/status/active', 
  authMiddleware, 
  nhanvienController.getActiveStaff
);

// Lấy danh sách nhân viên (admin only)
// Query: { page, limit, tinhTrang, chucVu }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  nhanvienController.getAllStaff
);

// Lấy thông tin 1 nhân viên
router.get('/:id', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  nhanvienController.getStaffById
);

// Tạo nhân viên mới (admin only)
// Body: { ID_ND, NgayVaoLam, SDT, ChucVu, TinhTrang }
router.post('/', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  nhanvienController.createStaff
);

// Cập nhật thông tin nhân viên (admin or self)
// Body: { NgayVaoLam, SDT, ChucVu, TinhTrang }
router.put('/:id', 
  authMiddleware, 
  nhanvienController.updateStaff
);

// Xóa nhân viên (admin only)
router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  nhanvienController.deleteStaff
);

// Cập nhật trạng thái nhân viên (admin only)
// Body: { TinhTrang }
router.patch('/:id/status', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  nhanvienController.updateStaffStatus
);

module.exports = router;
