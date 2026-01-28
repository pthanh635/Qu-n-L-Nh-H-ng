/**
 * Phiếu Nhập Routes - Quản lý phiếu nhập hàng
 * GET /phieunhap - Lấy danh sách phiếu nhập
 * POST /phieunhap - Tạo phiếu nhập mới
 * PUT /phieunhap/:id - Cập nhật phiếu nhập
 * DELETE /phieunhap/:id - Xóa phiếu nhập
 */

const express = require('express');
const router = express.Router();
const phieuNhapController = require('../controllers/phieunhap.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication & authorization
 */

// Lấy báo cáo nhập hàng theo thời gian
// Query: { fromDate, toDate }
router.get('/reports/by-date-range', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  phieuNhapController.getImportsByDateRange
);

// Lấy danh sách phiếu nhập (admin & staff)
// Query: { page, limit, fromDate, toDate }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuNhapController.getAllImports
);

// Lấy thông tin 1 phiếu nhập
router.get('/:id', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuNhapController.getImportById
);

// Tạo phiếu nhập mới (staff)
// Body: { ID_NV, items: [{ID_NL, SoLuong, DonGia}] }
router.post('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuNhapController.createImport
);

// Xác nhận & hoàn thành phiếu nhập (admin)
router.post('/:id/confirm', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  phieuNhapController.confirmImport
);

/**
 * Chi Tiết Phiếu Nhập (CTNhap)
 */

// Thêm nguyên liệu vào phiếu nhập
// Body: { ID_NL, SoLuong, DonGia }
router.post('/:id/items', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuNhapController.addItemToImport
);

// Xóa item khỏi phiếu nhập
router.delete('/:id/items/:materialId', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuNhapController.removeItemFromImport
);

module.exports = router;
