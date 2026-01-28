/**
 * Constants - Các giá trị enum & constant toàn hệ thống
 */

// ============================================
// USER ROLES
// ============================================
const ROLES = {
  ADMIN: 'admin',
  STAFF: 'nhanvien',
  CUSTOMER: 'khachhang'
};

const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Quản trị viên',
  [ROLES.STAFF]: 'Nhân viên',
  [ROLES.CUSTOMER]: 'Khách hàng'
};

// ============================================
// USER STATUS
// ============================================
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING_VERIFY: 'pending_verify'
};

// ============================================
// INVOICE STATUS
// ============================================
const INVOICE_STATUS = {
  OPEN: 'dang_mo',
  PAID: 'da_thanh_toan',
  CANCELLED: 'da_huy'
};

const INVOICE_STATUS_NAMES = {
  [INVOICE_STATUS.OPEN]: 'Đang mở',
  [INVOICE_STATUS.PAID]: 'Đã thanh toán',
  [INVOICE_STATUS.CANCELLED]: 'Đã hủy'
};

// ============================================
// TABLE STATUS
// ============================================
const TABLE_STATUS = {
  EMPTY: 'trong',
  IN_USE: 'dang_su_dung',
  RESERVED: 'da_dat'
};

const TABLE_STATUS_NAMES = {
  [TABLE_STATUS.EMPTY]: 'Trống',
  [TABLE_STATUS.IN_USE]: 'Đang sử dụng',
  [TABLE_STATUS.RESERVED]: 'Đã đặt'
};

// ============================================
// DISH STATUS
// ============================================
const DISH_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable'
};

const DISH_STATUS_NAMES = {
  [DISH_STATUS.AVAILABLE]: 'Có sẵn',
  [DISH_STATUS.UNAVAILABLE]: 'Không có'
};

// ============================================
// STAFF STATUS
// ============================================
const STAFF_STATUS = {
  WORKING: 'dang_lam',
  ABSENT: 'nghi',
  LEFT: 'da_nghi'
};

const STAFF_STATUS_NAMES = {
  [STAFF_STATUS.WORKING]: 'Đang làm',
  [STAFF_STATUS.ABSENT]: 'Nghỉ',
  [STAFF_STATUS.LEFT]: 'Đã nghỉ'
};

// ============================================
// PAYMENT METHODS
// ============================================
const PAYMENT_METHODS = {
  CASH: 'tien_mat',
  CARD: 'the_tin_dung',
  TRANSFER: 'chuyen_khoan',
  MOBILE: 'vi_dien_tu'
};

const PAYMENT_METHOD_NAMES = {
  [PAYMENT_METHODS.CASH]: 'Tiền mặt',
  [PAYMENT_METHODS.CARD]: 'Thẻ tín dụng',
  [PAYMENT_METHODS.TRANSFER]: 'Chuyển khoản',
  [PAYMENT_METHODS.MOBILE]: 'Ví điện tử'
};

// ============================================
// PAGINATION
// ============================================
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// ============================================
// ERROR CODES
// ============================================
const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

// ============================================
// SUCCESS MESSAGES
// ============================================
const SUCCESS_MESSAGES = {
  CREATE: 'Tạo mới thành công',
  UPDATE: 'Cập nhật thành công',
  DELETE: 'Xóa thành công',
  FETCH: 'Lấy dữ liệu thành công',
  LOGIN: 'Đăng nhập thành công',
  LOGOUT: 'Đăng xuất thành công',
  REGISTER: 'Đăng ký thành công',
  VERIFY: 'Xác nhận thành công'
};

// ============================================
// ERROR MESSAGES
// ============================================
const ERROR_MESSAGES = {
  NOT_FOUND: 'Không tìm thấy',
  UNAUTHORIZED: 'Không được phép',
  FORBIDDEN: 'Cấm truy cập',
  BAD_REQUEST: 'Yêu cầu không hợp lệ',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PASSWORD: 'Mật khẩu phải ít nhất 6 ký tự',
  DUPLICATE_EMAIL: 'Email này đã được đăng ký',
  DUPLICATE_PHONE: 'Số điện thoại này đã được đăng ký',
  INVALID_TOKEN: 'Token không hợp lệ',
  EXPIRED_TOKEN: 'Token đã hết hạn',
  SERVER_ERROR: 'Lỗi server nội bộ'
};

module.exports = {
  ROLES,
  ROLE_NAMES,
  USER_STATUS,
  INVOICE_STATUS,
  INVOICE_STATUS_NAMES,
  TABLE_STATUS,
  TABLE_STATUS_NAMES,
  DISH_STATUS,
  DISH_STATUS_NAMES,
  STAFF_STATUS,
  STAFF_STATUS_NAMES,
  PAYMENT_METHODS,
  PAYMENT_METHOD_NAMES,
  PAGINATION,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES
};
