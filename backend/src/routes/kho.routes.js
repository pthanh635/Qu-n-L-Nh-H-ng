/**
 * Kho Routes - Quản lý kho hàng & nguyên liệu
 * GET /kho - Lấy danh sách nguyên liệu trong kho
 * GET /kho/:id - Lấy thông tin 1 nguyên liệu
 * PUT /kho/:id - Cập nhật số lượng tồn
 */

const express = require('express');
const router = express.Router();
const khoController = require('../controllers/kho.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Require authentication & authorization
 */

// Lấy nguyên liệu sắp hết (admin)
// Query: { threshold }
router.get('/status/low-stock', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  khoController.getLowStockItems
);

// Lấy nguyên liệu tồn quá nhiều (admin)
// Query: { threshold }
router.get('/status/overstock', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  khoController.getOverstockItems
);

// Lấy danh sách nguyên liệu trong kho (admin & staff)
// Query: { page, limit, sortBy }
router.get('/', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  khoController.getAllInventory
);

// Lấy thông tin 1 nguyên liệu
router.get('/:id', 
  authMiddleware, 
  roleMiddleware(['admin', 'nhanvien']), 
  khoController.getInventoryItem
);

// Cập nhật số lượng tồn kho (admin only)
// Body: { SLTon }
router.put('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  khoController.updateStock
);

module.exports = router;
