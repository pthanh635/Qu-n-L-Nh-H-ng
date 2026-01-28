/**
 * Bàn Ăn Routes
 * CRUD operations cho quản lý bàn ăn
 * GET /ban - Lấy danh sách bàn
 * GET /ban/:id - Lấy thông tin 1 bàn
 * POST /ban - Tạo bàn mới
 * PUT /ban/:id - Cập nhật thông tin bàn
 * DELETE /ban/:id - Xóa bàn
 */

const express = require('express');
const router = express.Router();
const banController = require('../controllers/ban.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication
 */

// Lấy danh sách bàn trống
router.get('/status/available', 
  authMiddleware, 
  banController.getAvailableTables
);

// Lấy danh sách bàn đang sử dụng
router.get('/status/in-use', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  banController.getOccupiedTables
);

// Lấy danh sách bàn
// Query: { page, limit, trangThai }
router.get('/', 
  authMiddleware, 
  banController.getAllTables
);

// Lấy thông tin 1 bàn
router.get('/:id', 
  authMiddleware, 
  banController.getTableById
);

// Tạo bàn mới (admin only)
// Body: { TenBan, SoChoNgoi, ViTri }
router.post('/', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  banController.createTable
);

// Cập nhật thông tin bàn (admin only)
// Body: { TenBan, SoChoNgoi, ViTri, TrangThai }
router.put('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  banController.updateTable
);

// Xóa bàn (admin only)
router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  banController.deleteTable
);

// Cập nhật trạng thái bàn (staff)
// Body: { TrangThai: trong | dang_su_dung | da_dat }
router.patch('/:id/status', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  banController.updateTableStatus
);

module.exports = router;
