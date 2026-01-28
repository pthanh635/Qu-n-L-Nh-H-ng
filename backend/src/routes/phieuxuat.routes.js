/**
 * Phiếu Xuất Routes - Quản lý phiếu xuất hàng
 * GET /phieuxuat - Lấy danh sách phiếu xuất
 * POST /phieuxuat - Tạo phiếu xuất mới
 * PUT /phieuxuat/:id - Cập nhật phiếu xuất
 * DELETE /phieuxuat/:id - Xóa phiếu xuất
 */

const express = require('express');
const router = express.Router();
const phieuXuatController = require('../controllers/phieuxuat.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication & authorization
 */

// Lấy báo cáo xuất hàng theo thời gian
// Query: { fromDate, toDate }
router.get('/reports/by-date-range', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  phieuXuatController.getExportsByDateRange
);

// Lấy danh sách phiếu xuất (admin & staff)
// Query: { page, limit, fromDate, toDate }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuXuatController.getAllExports
);

// Lấy thông tin 1 phiếu xuất
router.get('/:id', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuXuatController.getExportById
);

// Tạo phiếu xuất mới (staff)
// Body: { ID_NV, items: [{ID_NL, SoLuong}] }
router.post('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuXuatController.createExport
);

// Xác nhận & hoàn thành phiếu xuất (admin)
router.post('/:id/confirm', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  phieuXuatController.confirmExport
);

/**
 * Chi Tiết Phiếu Xuất (CTXuat)
 */

// Thêm nguyên liệu vào phiếu xuất
// Body: { ID_NL, SoLuong }
router.post('/:id/items', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuXuatController.addItemToExport
);

// Xóa item khỏi phiếu xuất
router.delete('/:id/items/:materialId', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  phieuXuatController.removeItemFromExport
);

module.exports = router;
