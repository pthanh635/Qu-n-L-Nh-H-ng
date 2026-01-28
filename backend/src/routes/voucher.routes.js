/**
 * Voucher Routes
 * CRUD operations cho voucher/mã giảm giá
 * GET /voucher - Lấy danh sách voucher
 * POST /voucher - Tạo voucher mới
 * PUT /voucher/:id - Cập nhật voucher
 * DELETE /voucher/:id - Xóa voucher
 */

const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucher.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Public routes - Không cần authentication
 */

// Kiểm tra voucher có hợp lệ không
// Query: { code }
router.get('/validate/:code', voucherController.validateVoucher);

/**
 * Protected routes - Require authentication & authorization
 */

// Lấy danh sách voucher còn hàng
router.get('/status/available', 
  authMiddleware, 
  voucherController.getActiveVouchers
);

// Lấy danh sách voucher (admin & staff)
// Query: { page, limit }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  voucherController.getAllVouchers
);

// Lấy thông tin 1 voucher
router.get('/:id', 
  authMiddleware, 
  voucherController.getVoucherById
);

// Tạo voucher mới (admin only)
// Body: { CodeVoucher, MoTa, PhanTramGiam, SoLuong, DiemDoi }
router.post('/', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  voucherController.createVoucher
);

// Cập nhật voucher (admin only)
// Body: { MoTa, PhanTramGiam, SoLuong, DiemDoi }
router.put('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  voucherController.updateVoucher
);

// Xóa voucher (admin only)
router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  voucherController.deleteVoucher
);

// Sử dụng voucher (redeem)
// Body: { codeVoucher, userId }
router.post('/:id/redeem', 
  authMiddleware, 
  voucherController.redeemVoucher
);

module.exports = router;
