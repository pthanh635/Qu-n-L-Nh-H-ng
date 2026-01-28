# Middlewares Documentation

Tài liệu chi tiết về các middleware được sử dụng trong hệ thống.

## 1. Authentication Middleware (`auth.middleware.js`)

### Chức năng
Kiểm tra JWT token hợp lệ trong request header.

### Cách sử dụng

```javascript
const authMiddleware = require('../middlewares/auth.middleware');

// Trong route
router.post('/admin-endpoint', authMiddleware, controller);
```

### Header yêu cầu
```
Authorization: Bearer <JWT_TOKEN>
```

### Request object sau middleware
```javascript
req.user = {
  ID_ND: 1,
  Email: 'user@example.com',
  VaiTro: 'admin',
  // ... các field khác từ token
}
```

### Errors xử lý
- **401 Unauthorized** - Thiếu token hoặc token không hợp lệ
- **401 Unauthorized** - Token đã hết hạn (TokenExpiredError)

## 2. Role Middleware (`role.middleware.js`)

### Chức năng
Kiểm tra user có role phù hợp (RBAC - Role Based Access Control).

### Cách sử dụng

```javascript
const roleMiddleware = require('../middlewares/role.middleware');

// Admin only
router.delete('/user/:id', authMiddleware, roleMiddleware(['admin']), controller);

// Admin hoặc Staff
router.get('/reports', authMiddleware, roleMiddleware(['admin', 'nhanvien']), controller);

// Tất cả authenticated users
router.get('/profile', authMiddleware, roleMiddleware(), controller);
```

### Roles có sẵn
- `'admin'` - Quản trị viên
- `'nhanvien'` - Nhân viên/Staff
- `'khachhang'` - Khách hàng

### Error
- **403 Forbidden** - User không có role yêu cầu

### Quy tắc sử dụng
- **LUÔN** đặt `authMiddleware` trước `roleMiddleware`
- `authMiddleware` kiểm tra token, `roleMiddleware` kiểm tra role
- Không có `roleMiddleware` = tất cả authenticated users có quyền

## 3. Error Middleware (`error.middleware.js`)

### Chức năng
Xử lý tất cả errors từ controllers và middlewares.

### Cách sử dụng

```javascript
// Trong app.js (phải là middleware CUỐI CÙNG)
const errorHandler = require('./middlewares/error.middleware');

app.use(routes);
app.use(errorHandler);
```

### Errors được xử lý

#### Sequelize Validation Error
```javascript
// Error: SequelizeValidationError
// Response 400
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    { "field": "email", "message": "Email không hợp lệ" }
  ]
}
```

#### Duplicate Key Error
```javascript
// Error: SequelizeUniqueConstraintError
// Response 400
{
  "success": false,
  "message": "Dữ liệu đã tồn tại",
  "errors": [
    { "field": "email", "message": "email đã được sử dụng" }
  ]
}
```

#### Foreign Key Error
```javascript
// Error: SequelizeForeignKeyConstraintError
// Response 400
{
  "success": false,
  "message": "Dữ liệu tham chiếu không tồn tại"
}
```

#### JWT Errors
```javascript
// Invalid Token
{
  "success": false,
  "message": "Token không hợp lệ"
}

// Expired Token
{
  "success": false,
  "message": "Token đã hết hạn",
  "expiredAt": "2024-01-26T10:00:00.000Z"
}
```

#### Database Connection Error
```javascript
// Response 503
{
  "success": false,
  "message": "Không thể kết nối đến database"
}
```

### Custom API Error

Sử dụng `ApiError` class để throw errors có status code tùy chỉnh:

```javascript
const ApiError = require('../utils/error');

// Trong controller/service
throw ApiError.notFound('Sản phẩm không tìm thấy');
throw ApiError.unauthorized('Vui lòng đăng nhập');
throw ApiError.forbidden('Bạn không có quyền truy cập');
throw ApiError.badRequest('Email không hợp lệ');
throw ApiError.conflict('Bản ghi đã tồn tại');
```

## Middleware Chain

Thứ tự load middleware trong app.js rất quan trọng:

```javascript
// 1. Parsing middleware
app.use(express.json());
app.use(cors());

// 2. Logging middleware (optional)
app.use(requestLogger);

// 3. Routes
app.use('/api', routes);

// 4. 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// 5. Error handler (PHẢI CUỐI CÙNG)
app.use(errorMiddleware);
```

## Utility Functions

### Hash (`src/utils/hash.js`)
```javascript
const { hashPassword, verifyPassword } = require('../utils/hash');

// Hash password
const hashed = await hashPassword('myPassword123');

// Verify password
const isValid = await verifyPassword('myPassword123', hashed);
```

### Response (`src/utils/response.js`)
```javascript
const { 
  sendSuccess, 
  sendError, 
  sendPaginated, 
  sendNotFound 
} = require('../utils/response');

// Success response
sendSuccess(res, 200, 'Lấy dữ liệu thành công', data);

// Paginated response
sendPaginated(res, items, totalCount, page, limit, 'Lấy dữ liệu thành công');

// Error responses
sendError(res, 400, 'Dữ liệu không hợp lệ', errors);
sendNotFound(res, 'Người dùng không tìm thấy');
```

### Validation (`src/utils/validate.js`)
```javascript
const { 
  isValidEmail, 
  isValidPassword,
  validateRequired,
  validatePagination
} = require('../utils/validate');

// Check email
if (!isValidEmail(email)) {
  throw new Error('Email không hợp lệ');
}

// Check required fields
const { valid, errors } = validateRequired(req.body, ['email', 'password']);

// Pagination
const { page, limit } = validatePagination(req.query.page, req.query.limit);
```

### JWT (`src/utils/jwt.js`)
```javascript
const { 
  generateAccessToken, 
  generateRefreshToken,
  verifyToken,
  generateTokenPair 
} = require('../utils/jwt');

// Generate tokens
const { accessToken, refreshToken } = generateTokenPair({
  ID_ND: user.ID_ND,
  Email: user.Email,
  VaiTro: user.VaiTro
});

// Verify token (usually in auth middleware)
const decoded = verifyToken(token);
```

### Error Class (`src/utils/error.js`)
```javascript
const ApiError = require('../utils/error');

// Throw errors
throw ApiError.notFound('User not found');
throw ApiError.badRequest('Invalid email', { email: 'Invalid format' });
throw ApiError.unauthorized('Please login');
```

## Constants (`src/constants/roles.js`)

```javascript
const {
  ROLES,
  INVOICE_STATUS,
  TABLE_STATUS,
  DISH_STATUS,
  PAYMENT_METHODS
} = require('../constants/roles');

// Usage
if (user.VaiTro === ROLES.ADMIN) { }
if (invoice.TrangThai === INVOICE_STATUS.PAID) { }
```

## Best Practices

1. **Always use authMiddleware before roleMiddleware**
2. **Put error handler as the last middleware**
3. **Use sendSuccess/sendError for consistent responses**
4. **Use ApiError for custom errors with status codes**
5. **Validate input before processing**
6. **Use try-catch in async operations**
7. **Log errors for debugging**
8. **Never expose sensitive data in error messages**
