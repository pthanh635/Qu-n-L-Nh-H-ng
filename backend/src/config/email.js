require('dotenv').config();

/**
 * Email Configuration (nếu sử dụng nodemailer)
 * Environment Variables:
 * - EMAIL_HOST: SMTP server
 * - EMAIL_PORT: SMTP port
 * - EMAIL_USER: Email account
 * - EMAIL_PASS: Email password
 * - EMAIL_FROM: Sender email
 */

const emailConfig = {
  // SMTP configuration
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,  // true for 465, false for 587

  // Authentication
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  // Email settings
  from: process.env.EMAIL_FROM || 'noreply@restaurant.com',
  fromName: 'Quản Lý Nhà Hàng',

  // Connection pool for sending multiple emails at once
  connectionUrl: process.env.EMAIL_CONNECTION_URL,  // tùy chọn, override host/port/secure
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,    // ms
  rateLimit: 5,       // max 5 messages per rateDelta

  // TLS configuration
  tls: {
    rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false'
  }
};

/**
 * Email templates configuration
 */
const emailTemplates = {
  // Welcome email khi đăng ký
  welcome: {
    subject: 'Chào mừng đến với Quản Lý Nhà Hàng',
    template: 'welcome'
  },

  // Xác thực email
  emailVerification: {
    subject: 'Xác thực email của bạn',
    template: 'verify-email'
  },

  // Đặt lại mật khẩu
  resetPassword: {
    subject: 'Đặt lại mật khẩu',
    template: 'reset-password'
  },

  // Xác nhận đơn hàng
  orderConfirmation: {
    subject: 'Xác nhận hóa đơn',
    template: 'order-confirmation'
  },

  // Thông báo thanh toán
  paymentNotification: {
    subject: 'Thông báo thanh toán',
    template: 'payment-notification'
  }
};

module.exports = {
  emailConfig,
  emailTemplates
};
