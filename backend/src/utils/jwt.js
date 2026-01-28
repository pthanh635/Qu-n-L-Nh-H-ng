/**
 * JWT Token Utility
 * Tạo & quản lý JWT tokens
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'restaurant_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Tạo JWT Access Token
 * @param {Object} payload - Data cần encode (user info)
 * @param {number} expiresIn - Thời gian hết hạn (seconds)
 * @returns {string} - JWT token
 */
function generateAccessToken(payload, expiresIn = JWT_EXPIRES_IN) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload phải là một object');
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn
    });

    return token;
  } catch (error) {
    console.error('❌ Generate Token Error:', error.message);
    throw error;
  }
}

/**
 * Tạo JWT Refresh Token
 * @param {Object} payload - Data cần encode
 * @returns {string} - Refresh token
 */
function generateRefreshToken(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Payload phải là một object');
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });

    return token;
  } catch (error) {
    console.error('❌ Generate Refresh Token Error:', error.message);
    throw error;
  }
}

/**
 * Verify JWT Token
 * @param {string} token - Token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token đã hết hạn');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token không hợp lệ');
    }
    throw error;
  }
}

/**
 * Decode token (không verify)
 * @param {string} token - Token to decode
 * @returns {Object} - Decoded payload
 */
function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('❌ Decode Error:', error.message);
    return null;
  }
}

/**
 * Tạo token pair (access + refresh)
 * @param {Object} payload - User data
 * @returns {Object} - { accessToken, refreshToken }
 */
function generateTokenPair(payload) {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair
};
