require('dotenv').config();

/**
 * JWT Configuration
 * Environment Variables:
 * - JWT_SECRET: Secret key for signing tokens (required)
 * - ACCESS_TOKEN_EXPIRY: Access token expiry time (default: 1d)
 * - REFRESH_TOKEN_EXPIRY: Refresh token expiry time (default: 7d)
 * - JWT_ALGORITHM: Algorithm for signing (default: HS256)
 */

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET environment variable');
  process.exit(1);
}

const jwtConfig = {
  // Secret key cho signing/verifying tokens
  secret: process.env.JWT_SECRET,

  // Access token - ngắn hạn, dùng cho API requests
  accessToken: {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',  // 1 day
    algorithm: 'HS256',
    issuer: 'restaurant-api',
    audience: 'restaurant-app'
  },

  // Refresh token - dài hạn, dùng để lấy access token mới
  refreshToken: {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d', // 7 days
    algorithm: 'HS256',
    issuer: 'restaurant-api',
    audience: 'restaurant-app'
  },

  // Password reset token - rất ngắn hạn
  resetToken: {
    expiresIn: process.env.RESET_TOKEN_EXPIRY || '15m',  // 15 minutes
    algorithm: 'HS256',
    issuer: 'restaurant-api'
  },

  // Email verification token
  verifyToken: {
    expiresIn: process.env.VERIFY_TOKEN_EXPIRY || '24h',  // 24 hours
    algorithm: 'HS256',
    issuer: 'restaurant-api'
  }
};

/**
 * Token payload structure:
 * {
 *   ID_ND: number (user id),
 *   Email: string,
 *   VaiTro: string ('admin' | 'nhanvien' | 'khachhang'),
 *   iat: number (issued at timestamp),
 *   exp: number (expiration timestamp),
 *   iss: string (issuer),
 *   aud: string (audience)
 * }
 */

module.exports = jwtConfig;