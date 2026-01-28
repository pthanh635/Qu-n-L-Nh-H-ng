/**
 * Thống Kê Routes - Reports & Analytics
 * Lấy các báo cáo, thống kê về doanh thu, số lượng, v.v
 */

const express = require('express');
const router = express.Router();
const thongkeController = require('../controllers/thongke.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

/**
 * Protected routes - Admin only
 */

// Lấy tổng quan dashboard
router.get('/dashboard', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getDashboard
);

// Doanh thu hàng ngày
// Query: { days }
router.get('/revenue/daily', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getDailyRevenue
);

// Doanh thu hàng tuần
// Query: { weeks }
router.get('/revenue/weekly', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getWeeklyRevenue
);

// Doanh thu hàng tháng
// Query: { months }
router.get('/revenue/monthly', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getMonthlyRevenue
);

// Món ăn bán chạy nhất
// Query: { limit }
router.get('/dishes/top', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getTopDishes
);

// Khách hàng VIP
// Query: { limit }
router.get('/customers/top', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getTopCustomers
);

// Báo cáo lợi nhuận
// Query: { fromDate, toDate }
router.get('/profit', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getProfitReport
);

// Báo cáo kho hàng
// Query: { status }
router.get('/inventory', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getInventoryReport
);

// Hiệu suất nhân viên
// Query: { fromDate, toDate }
router.get('/staff-performance', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  thongkeController.getStaffPerformance
);

module.exports = router;
