/**
 * Authentication Routes
 * POST /auth/register - Đăng ký tài khoản mới
 * POST /auth/login - Đăng nhập
 * POST /auth/logout - Đăng xuất
 * POST /auth/refresh-token - Refresh JWT token
 * POST /auth/verify-email - Xác nhận email
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Public routes
 */

// Đăng ký tài khoản mới
// Body: { Ten, Email, MatKhau, VaiTro (optional, default: khachhang) }
router.post('/register', authController.register);

// Đăng nhập
// Body: { Email, MatKhau }
// Response: { token, user }
router.post('/login', authController.login);

// Verify email
// Body: { Email, VerifyCode }
router.post('/verify-email', authController.verifyEmail);

// Refresh token
// Body: { refreshToken }
router.post('/refresh-token', authController.refreshToken);

/**
 * Protected routes - Require authentication
 */

// Đăng xuất
router.post('/logout', authMiddleware, authController.logout);

// Lấy thông tin user hiện tại
router.get('/me', authMiddleware, authController.getCurrentUser);

// Change password
// Body: { oldPassword, newPassword }
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
