# Utilities Documentation

Tài liệu về các utility functions được sử dụng trong hệ thống.

## File Overview

| File | Purpose | Key Functions |
|------|---------|---------------|
| `hash.js` | Mã hóa password | `hashPassword()`, `verifyPassword()` |
| `response.js` | Format response JSON | `sendSuccess()`, `sendError()`, `sendPaginated()` |
| `validate.js` | Validate input data | `isValidEmail()`, `validateRequired()`, etc. |
| `jwt.js` | Quản lý JWT tokens | `generateAccessToken()`, `verifyToken()` |
| `error.js` | Custom API Error class | `ApiError.notFound()`, `ApiError.badRequest()` |

---

## 1. Hash Utility (`hash.js`)

### Functions

#### `hashPassword(password)`
Hash password sử dụng bcrypt (10 rounds).

```javascript
const { hashPassword } = require('../utils/hash');

const hashedPassword = await hashPassword('myPassword123');
// Returns: $2b$10$... (hashed string)
```

#### `verifyPassword(password, hashedPassword)`
Kiểm tra password có khớp với hash không.

```javascript
const { verifyPassword } = require('../utils/hash');

const isMatch = await verifyPassword('myPassword123', hashedFromDB);
// Returns: true | false
```

---

## 2. Response Utility (`response.js`)

### Functions

#### `sendSuccess(res, statusCode, message, data)`
Gửi success response.

```javascript
const { sendSuccess } = require('../utils/response');

sendSuccess(res, 200, 'Lấy dữ liệu thành công', { id: 1, name: 'John' });
// Response:
// {
//   "success": true,
//   "message": "Lấy dữ liệu thành công",
//   "data": { "id": 1, "name": "John" }
// }
```

#### `sendError(res, statusCode, message, errors)`
Gửi error response.

```javascript
const { sendError } = require('../utils/response');

sendError(res, 400, 'Dữ liệu không hợp lệ', { email: 'Invalid' });
// Response:
// {
//   "success": false,
//   "message": "Dữ liệu không hợp lệ",
//   "errors": { "email": "Invalid" }
// }
```

#### `sendPaginated(res, data, total, page, limit, message)`
Gửi paginated response.

```javascript
const { sendPaginated } = require('../utils/response');

sendPaginated(res, items, 150, 1, 10, 'Lấy dữ liệu thành công');
// Response:
// {
//   "success": true,
//   "message": "Lấy dữ liệu thành công",
//   "data": [...],
//   "pagination": {
//     "total": 150,
//     "page": 1,
//     "limit": 10,
//     "pages": 15,
//     "hasNextPage": true,
//     "hasPrevPage": false
//   }
// }
```

#### Shortcut Functions
```javascript
// Created (201)
sendCreated(res, data, 'Tạo mới thành công');

// Not Found (404)
sendNotFound(res, 'Không tìm thấy');

// Unauthorized (401)
sendUnauthorized(res, 'Vui lòng đăng nhập');

// Forbidden (403)
sendForbidden(res, 'Bạn không có quyền');

// Validation Error (400)
sendValidationError(res, errors, 'Dữ liệu không hợp lệ');

// Server Error (500)
sendServerError(res, 'Lỗi server', error);
```

---

## 3. Validation Utility (`validate.js`)

### Email Functions

#### `isValidEmail(email)`
Kiểm tra email hợp lệ.

```javascript
const { isValidEmail } = require('../utils/validate');

isValidEmail('user@example.com'); // true
isValidEmail('invalid.email');    // false
```

### Password Functions

#### `isValidPassword(password)`
Kiểm tra password (tối thiểu 6 ký tự).

```javascript
const { isValidPassword } = require('../utils/validate');

isValidPassword('myPass123'); // true
isValidPassword('12345');     // false
```

### Phone Functions

#### `isValidPhone(phone)`
Kiểm tra số điện thoại VN format.

```javascript
const { isValidPhone } = require('../utils/validate');

isValidPhone('0912345678');  // true
isValidPhone('09123456789'); // true
isValidPhone('1234567');     // false
```

### Common Validations

#### `isValidId(id)`
```javascript
isValidId(123);   // true
isValidId('abc'); // false
```

#### `isNotEmpty(str)`
```javascript
isNotEmpty('hello');     // true
isNotEmpty('   ');       // false (only spaces)
isNotEmpty(null);        // false
```

#### `isValidNumber(num, min, max)`
```javascript
isValidNumber(50);           // true
isValidNumber('100', 0, 200); // true
isValidNumber(300, 0, 200);   // false (exceeds max)
```

#### `isValidDate(date)`
```javascript
isValidDate('2025-01-26');      // true
isValidDate(new Date());        // true
isValidDate('invalid-date');    // false
```

### Required Fields Validation

#### `validateRequired(obj, fields)`
```javascript
const { validateRequired } = require('../utils/validate');

const result = validateRequired(req.body, ['email', 'password']);
// Returns: { valid: true, errors: [] }
// or:      { valid: false, errors: ['email là bắt buộc'] }

if (!result.valid) {
  return sendValidationError(res, result.errors);
}
```

### Pagination

#### `validatePagination(page, limit)`
```javascript
const { validatePagination } = require('../utils/validate');

const { page, limit } = validatePagination(req.query.page, req.query.limit);
// Max limit is 100, default page is 1, default limit is 10
```

### Date Range

#### `validateDateRange(fromDate, toDate)`
```javascript
const { validateDateRange } = require('../utils/validate');

const result = validateDateRange('2025-01-01', '2025-01-31');
// Returns: { valid: true }
// or:      { valid: false, error: 'Ngày bắt đầu phải nhỏ hơn...' }
```

### Price & Percentage

#### `isValidPrice(price)`
```javascript
isValidPrice(99.99);  // true
isValidPrice('50');   // true
isValidPrice(-10);    // false
```

#### `isValidPercentage(percent)`
```javascript
isValidPercentage(50);   // true
isValidPercentage(100);  // true
isValidPercentage(150);  // false
```

### Enums

#### `isValidRole(role)`
```javascript
isValidRole('admin');       // true
isValidRole('nhanvien');    // true
isValidRole('khachhang');   // true
isValidRole('invalid');     // false
```

#### `isValidStatus(status, type)`
```javascript
isValidStatus('dang_mo', 'hoadon');  // true
isValidStatus('trong', 'ban');       // true
isValidStatus('available', 'monan'); // true
isValidStatus('invalid', 'hoadon');  // false
```

---

## 4. JWT Utility (`jwt.js`)

### Functions

#### `generateAccessToken(payload, expiresIn)`
Tạo access token.

```javascript
const { generateAccessToken } = require('../utils/jwt');

const token = generateAccessToken({
  ID_ND: 1,
  Email: 'user@example.com',
  VaiTro: 'admin'
}, '1d');
```

#### `generateRefreshToken(payload)`
Tạo refresh token.

```javascript
const { generateRefreshToken } = require('../utils/jwt');

const refreshToken = generateRefreshToken({
  ID_ND: 1,
  Email: 'user@example.com'
});
```

#### `verifyToken(token)`
Xác minh token hợp lệ.

```javascript
const { verifyToken } = require('../utils/jwt');

try {
  const decoded = verifyToken(token);
  console.log(decoded); // { ID_ND: 1, Email: '...', ... }
} catch (error) {
  console.log(error.message); // Token đã hết hạn | Token không hợp lệ
}
```

#### `decodeToken(token)`
Decode token (không verify).

```javascript
const { decodeToken } = require('../utils/jwt');

const decoded = decodeToken(token);
// Returns decoded payload or null if invalid
```

#### `generateTokenPair(payload)`
Tạo access + refresh token cùng lúc.

```javascript
const { generateTokenPair } = require('../utils/jwt');

const { accessToken, refreshToken, expiresIn } = generateTokenPair({
  ID_ND: 1,
  Email: 'user@example.com',
  VaiTro: 'admin'
});

// Response to client:
// { accessToken, refreshToken, expiresIn }
```

---

## 5. Error Class (`error.js`)

### Usage

```javascript
const ApiError = require('../utils/error');

// Throw errors
throw ApiError.notFound('Người dùng không tìm thấy');
throw ApiError.unauthorized('Vui lòng đăng nhập');
throw ApiError.forbidden('Bạn không có quyền');
throw ApiError.badRequest('Email không hợp lệ');
throw ApiError.conflict('Bản ghi đã tồn tại');
throw ApiError.validationError('Dữ liệu không hợp lệ', { email: 'Invalid' });
throw ApiError.serverError('Lỗi server');
```

### Predefined Methods

| Method | Status | Message |
|--------|--------|---------|
| `badRequest()` | 400 | Yêu cầu không hợp lệ |
| `unauthorized()` | 401 | Không được xác thực |
| `forbidden()` | 403 | Cấm truy cập |
| `notFound()` | 404 | Không tìm thấy |
| `conflict()` | 409 | Xung đột dữ liệu |
| `validationError()` | 400 | Dữ liệu không hợp lệ |
| `serverError()` | 500 | Lỗi server |
| `custom(status, msg)` | Custom | Tùy chỉnh |

### Example in Controller

```javascript
const ApiError = require('../utils/error');
const { User } = require('../models');

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      throw ApiError.notFound('Người dùng không tìm thấy');
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    next(error); // Pass to error middleware
  }
};
```

---

## Usage Patterns

### In Controller

```javascript
const ApiError = require('../utils/error');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { validateRequired, validatePagination } = require('../utils/validate');

exports.createUser = async (req, res, next) => {
  try {
    // Validate required fields
    const { valid, errors } = validateRequired(req.body, ['email', 'password']);
    if (!valid) {
      return sendValidationError(res, errors);
    }

    // Validate email
    if (!isValidEmail(req.body.email)) {
      throw ApiError.badRequest('Email không hợp lệ');
    }

    // Create user
    const user = await User.create(req.body);

    // Send response
    sendCreated(res, user, 'Tạo người dùng thành công');
  } catch (error) {
    next(error);
  }
};
```

### In Service

```javascript
const ApiError = require('../utils/error');
const { hashPassword, verifyPassword } = require('../utils/hash');

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw ApiError.unauthorized('Email hoặc mật khẩu sai');
  }

  const isValid = await verifyPassword(password, user.MatKhau);
  if (!isValid) {
    throw ApiError.unauthorized('Email hoặc mật khẩu sai');
  }

  return user;
};
```

---

## Constants (`constants/roles.js`)

```javascript
const {
  ROLES,
  USER_STATUS,
  INVOICE_STATUS,
  TABLE_STATUS,
  PAYMENT_METHODS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES
} = require('../constants/roles');

// Usage
if (user.VaiTro === ROLES.ADMIN) { }
if (invoice.TrangThai === INVOICE_STATUS.PAID) { }
const msg = SUCCESS_MESSAGES.CREATE; // 'Tạo mới thành công'
```
