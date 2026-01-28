/**
 * Input Validation Utility
 * Kiểm tra & validate input data trước khi lưu vào database
 */

/**
 * Kiểm tra email hợp lệ
 * @param {string} email - Email address
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Kiểm tra password hợp lệ
 * Yêu cầu: ít nhất 6 ký tự
 * @param {string} password - Password
 * @returns {boolean}
 */
function isValidPassword(password) {
  return password && password.length >= 6;
}

/**
 * Kiểm tra số điện thoại hợp lệ (VN format)
 * @param {string} phone - Phone number
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone);
}

/**
 * Kiểm tra ID có hợp lệ không
 * @param {number|string} id - ID
 * @returns {boolean}
 */
function isValidId(id) {
  return id && Number.isInteger(Number(id)) && Number(id) > 0;
}

/**
 * Kiểm tra string không rỗng
 * @param {string} str - String
 * @returns {boolean}
 */
function isNotEmpty(str) {
  return str && typeof str === 'string' && str.trim().length > 0;
}

/**
 * Kiểm tra number hợp lệ
 * @param {number|string} num - Number
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {boolean}
 */
function isValidNumber(num, min = null, max = null) {
  const n = Number(num);
  if (isNaN(n)) return false;

  if (min !== null && n < min) return false;
  if (max !== null && n > max) return false;

  return true;
}

/**
 * Kiểm tra date hợp lệ
 * @param {string|Date} date - Date
 * @returns {boolean}
 */
function isValidDate(date) {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

/**
 * Sanitize string input - xóa leading/trailing spaces
 * @param {string} str - Input string
 * @returns {string}
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

/**
 * Validate object required fields
 * @param {Object} obj - Object to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Object} - { valid: boolean, errors: Array }
 */
function validateRequired(obj, requiredFields = []) {
  const errors = [];

  requiredFields.forEach(field => {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      errors.push(`${field} là bắt buộc`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate enum values
 * @param {string} value - Value to check
 * @param {Array<string>} allowedValues - Allowed values
 * @returns {boolean}
 */
function isValidEnum(value, allowedValues = []) {
  return allowedValues.includes(value);
}

/**
 * Validate page & limit for pagination
 * @param {number|string} page - Page number
 * @param {number|string} limit - Items per page
 * @returns {Object} - { page: number, limit: number }
 */
function validatePagination(page = 1, limit = 10) {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit) || 10)); // max 100 items per page

  return { page: p, limit: l };
}

/**
 * Validate date range
 * @param {string|Date} fromDate - Start date
 * @param {string|Date} toDate - End date
 * @returns {Object} - { valid: boolean, error: string }
 */
function validateDateRange(fromDate, toDate) {
  if (!isValidDate(fromDate) || !isValidDate(toDate)) {
    return {
      valid: false,
      error: 'Ngày không hợp lệ'
    };
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (from > to) {
    return {
      valid: false,
      error: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc'
    };
  }

  return { valid: true };
}

/**
 * Validate price (must be positive decimal)
 * @param {number|string} price - Price value
 * @returns {boolean}
 */
function isValidPrice(price) {
  const p = parseFloat(price);
  return !isNaN(p) && p > 0;
}

/**
 * Validate percentage (0-100)
 * @param {number|string} percent - Percentage value
 * @returns {boolean}
 */
function isValidPercentage(percent) {
  const p = parseFloat(percent);
  return !isNaN(p) && p >= 0 && p <= 100;
}

/**
 * Validate user role
 * @param {string} role - User role
 * @returns {boolean}
 */
function isValidRole(role) {
  return ['admin', 'nhanvien', 'khachhang'].includes(role);
}

/**
 * Validate status enum
 * @param {string} status - Status value
 * @param {string} type - Type (hoadon | ban | monan | nhanvien)
 * @returns {boolean}
 */
function isValidStatus(status, type = 'hoadon') {
  const validStatuses = {
    hoadon: ['dang_mo', 'da_thanh_toan', 'da_huy'],
    ban: ['trong', 'dang_su_dung', 'da_dat'],
    monan: ['available', 'unavailable'],
    nhanvien: ['dang_lam', 'nghi', 'da_nghi']
  };

  return validStatuses[type]?.includes(status) || false;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidId,
  isNotEmpty,
  isValidNumber,
  isValidDate,
  sanitizeString,
  validateRequired,
  isValidEnum,
  validatePagination,
  validateDateRange,
  isValidPrice,
  isValidPercentage,
  isValidRole,
  isValidStatus
};
