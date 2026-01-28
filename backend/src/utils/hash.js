/**
 * Password Hashing Utility
 * Sử dụng bcrypt để hash password an toàn
 */

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; // Số vòng hash (càng cao càng bảo mật nhưng chậm hơn)

/**
 * Hash password
 * @param {string} password - Password gốc
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  try {
    if (!password) {
      throw new Error('Password không được để trống');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('❌ Hash Error:', error.message);
    throw error;
  }
}

/**
 * Kiểm tra password có khớp với hash không
 * @param {string} password - Password gốc
 * @param {string} hashedPassword - Hashed password từ database
 * @returns {Promise<boolean>} - true nếu match, false nếu không
 */
async function verifyPassword(password, hashedPassword) {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Password và hashedPassword không được để trống');
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('❌ Verify Error:', error.message);
    throw error;
  }
}

module.exports = {
  hashPassword,
  verifyPassword
};
