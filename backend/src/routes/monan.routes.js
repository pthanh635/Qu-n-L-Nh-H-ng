/**
 * Món Ăn Routes
 * CRUD operations cho quản lý menu
 * GET /monan - Lấy danh sách món ăn
 * GET /monan/:id - Lấy thông tin 1 món ăn
 * POST /monan - Tạo món ăn mới
 * PUT /monan/:id - Cập nhật thông tin
 * DELETE /monan/:id - Xóa món ăn
 */

const express = require('express');
const router = express.Router();
const monAnController = require('../controllers/monan.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Public routes - Không cần authentication
 */

// Lấy danh sách món ăn (công khai)
// Query: { page, limit, danhmuc, trangThai }
router.get('/', monAnController.getAllDishes);

// Tìm kiếm món ăn
// Query: { q }
router.get('/search/by-name', monAnController.searchDishes);

// Lấy danh sách theo danh mục
// Query: { danhMucId, page, limit }
router.get('/category/:categoryId', monAnController.getDishesByCategory);

// Lấy thông tin 1 món ăn
router.get('/:id', monAnController.getDishById);

/**
 * Protected routes - Require authentication & authorization
 */

// Tạo món ăn mới (admin only)
// Body: { TenMonAn, DonGia, MoTa, ID_DanhMuc, TrangThai, HinhAnh }
router.post('/', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  monAnController.createDish
);

// Cập nhật thông tin món ăn (admin only)
// Body: { TenMonAn, DonGia, MoTa, ID_DanhMuc, TrangThai, HinhAnh }
router.put('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  monAnController.updateDish
);

// Xóa món ăn (admin only)
router.delete('/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  monAnController.deleteDish
);

// Cập nhật trạng thái món ăn (admin only)
// Body: { TrangThai: available | unavailable }
router.patch('/:id/status', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  monAnController.updateDishStatus
);

// Cập nhật giá món ăn (admin only)
// Body: { DonGia }
router.patch('/:id/price', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  monAnController.updateDishPrice
);

// Lấy danh sách món có sẵn
router.get('/availability/available', 
  monAnController.getAvailableDishes
);

// Lấy món ăn theo khoảng giá
// Query: { minPrice, maxPrice }
router.get('/price/range', 
  monAnController.getDishesByPriceRange
);

module.exports = router;
