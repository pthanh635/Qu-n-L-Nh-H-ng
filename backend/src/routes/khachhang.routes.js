/**
 * Khách Hàng Routes
 * CRUD operations cho khách hàng
 * GET /khachhang - Lấy danh sách khách hàng
 * GET /khachhang/:id - Lấy thông tin 1 khách hàng
 * PUT /khachhang/:id - Cập nhật thông tin
 * DELETE /khachhang/:id - Xóa khách hàng
 */

const express = require('express');
const router = express.Router();
const khachhangController = require('../controllers/khachhang.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication
 */

// Lấy khách hàng theo chi tiêu cao nhất (admin)
router.get('/stats/top-spenders', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  khachhangController.getTopCustomers
);

// Lấy danh sách khách hàng (admin or staff)
// Query: { page, limit, sortBy }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  khachhangController.getAllCustomers
);

// Lấy thông tin 1 khách hàng
router.get('/:id', 
  authMiddleware, 
  khachhangController.getCustomerById
);

// Cập nhật thông tin khách hàng (admin or self)
// Body: { NgayThamGia, ChiTieu, DiemTichLuy }
router.put('/:id', 
  authMiddleware, 
  khachhangController.updateCustomer
);

// Xóa khách hàng (admin only)
router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  khachhangController.deleteCustomer
);

// Cộng điểm tích lũy cho khách hàng
// Body: { DiemCong, lyDo }
router.post('/:id/loyalty-points/add', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  khachhangController.addLoyaltyPoints
);

// Sử dụng điểm để đổi voucher
// Body: { DiemSuDung, codeVoucher }
router.post('/:id/loyalty-points/redeem', 
  authMiddleware, 
  khachhangController.redeemLoyaltyPoints
);

module.exports = router;
