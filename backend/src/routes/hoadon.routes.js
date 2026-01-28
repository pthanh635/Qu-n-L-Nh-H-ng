/**
 * Hóa Đơn Routes
 * CRUD operations cho hóa đơn và chi tiết hóa đơn
 * GET /hoadon - Lấy danh sách hóa đơn
 * POST /hoadon - Tạo hóa đơn mới
 * PUT /hoadon/:id - Cập nhật hóa đơn
 * POST /hoadon/:id/items - Thêm món vào hóa đơn
 * DELETE /hoadon/:id/items/:dishId - Xóa món khỏi hóa đơn
 */

const express = require('express');
const router = express.Router();
const hoadonController = require('../controllers/hoadon.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication & authorization
 */

// Lấy danh sách hóa đơn (admin & staff)
// Query: { page, limit, trangThai, fromDate, toDate }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  hoadonController.getAllInvoices
);

// Lấy thông tin 1 hóa đơn
router.get('/:id', 
  authMiddleware, 
  hoadonController.getInvoiceById
);

// Tạo hóa đơn mới (staff)
// Body: { ID_KH (optional), ID_NV, ID_Ban (optional), items: [{ID_MonAn, SoLuong, GhiChu}] }
router.post('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  hoadonController.createInvoice
);

// Thanh toán hóa đơn (staff)
// Body: { HinhThucThanhToan }
router.post('/:id/checkout', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  hoadonController.checkout
);

// Hủy hóa đơn (admin or creator)
// Body: { lyDo }
router.post('/:id/cancel', 
  authMiddleware, 
  hoadonController.cancelInvoice
);

/**
 * Chi Tiết Hóa Đơn (CTHD) - Quản lý items trong hóa đơn
 */

// Thêm món vào hóa đơn (staff)
// Body: { ID_MonAn, SoLuong, GhiChu (optional) }
router.post('/:id/items', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  hoadonController.addItemToInvoice
);

// Xóa món khỏi hóa đơn (staff)
router.delete('/:id/items/:dishId', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  hoadonController.removeItemFromInvoice
);

// Áp dụng voucher cho hóa đơn (staff)
// Body: { CodeVoucher }
router.post('/:id/apply-voucher', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  hoadonController.applyVoucher
);

module.exports = router;
