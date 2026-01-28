# Configuration Documentation

Tài liệu về các file cấu hình của hệ thống.

## Overview

| File | Purpose |
|------|---------|
| `database.js` | MySQL & Sequelize configuration |
| `jwt.js` | JWT token configuration |
| `server.js` | Express server configuration |
| `email.js` | Email/SMTP configuration |
| `payment.js` | Payment gateway configuration |
| `logging.js` | Logging configuration |
| `index.js` | Tập hợp tất cả configurations |
| `.env.example` | Example environment variables |

---

## 1. Database Configuration (`database.js`)

### Purpose
Cấu hình kết nối MySQL và Sequelize ORM.

### Features
- **Connection Pooling**: Max 10 connections, min 0
- **Timezone**: +07:00 (Vietnam time)
- **Retry Strategy**: Tự động retry nếu connection failed
- **Environment Variables**:
  - `DB_HOST`: MySQL host (default: localhost)
  - `DB_PORT`: MySQL port (default: 3306)
  - `DB_USER`: MySQL username
  - `DB_PASSWORD`: MySQL password
  - `DB_NAME`: Database name
  - `NODE_ENV`: Development/production (ảnh hưởng logging)

### Usage

```javascript
const { sequelize, connectDB, disconnectDB } = require('../config/database');

// Connect to database
await connectDB();

// Use sequelize for queries
const users = await sequelize.models.NguoiDung.findAll();

// Disconnect (khi shutdown server)
await disconnectDB();
```

### Retry Strategy
Tự động retry connection nếu xảy ra:
- `SequelizeConnectionError`
- `SequelizeTimeoutError`
- `PROTOCOL_CONNECTION_LOST`
- `ECONNREFUSED`
- `ENOTFOUND`

---

## 2. JWT Configuration (`jwt.js`)

### Purpose
Cấu hình JWT token generation và verification.

### Token Types

#### Access Token
- **Expiry**: 1 day (configurable via `ACCESS_TOKEN_EXPIRY`)
- **Usage**: API requests in `Authorization: Bearer <token>` header
- **Payload**: `{ ID_ND, Email, VaiTro, iat, exp, iss, aud }`

```javascript
const { generateAccessToken } = require('../utils/jwt');
const token = generateAccessToken({
  ID_ND: 1,
  Email: 'user@example.com',
  VaiTro: 'admin'
});
```

#### Refresh Token
- **Expiry**: 7 days (configurable via `REFRESH_TOKEN_EXPIRY`)
- **Usage**: Refresh access token when expired
- **Payload**: `{ ID_ND, Email, iat, exp, iss, aud }`

```javascript
const { generateRefreshToken } = require('../utils/jwt');
const refreshToken = generateRefreshToken({
  ID_ND: 1,
  Email: 'user@example.com'
});
```

#### Reset Token
- **Expiry**: 15 minutes (configurable via `RESET_TOKEN_EXPIRY`)
- **Usage**: Password reset email links

#### Verify Token
- **Expiry**: 24 hours (configurable via `VERIFY_TOKEN_EXPIRY`)
- **Usage**: Email verification links

### Environment Variables
- `JWT_SECRET`: Secret key for signing tokens (REQUIRED)
- `ACCESS_TOKEN_EXPIRY`: Access token expiry (default: '1d')
- `REFRESH_TOKEN_EXPIRY`: Refresh token expiry (default: '7d')
- `RESET_TOKEN_EXPIRY`: Reset token expiry (default: '15m')
- `VERIFY_TOKEN_EXPIRY`: Verify token expiry (default: '24h')

### Token Verification

```javascript
const { verifyToken } = require('../utils/jwt');

try {
  const decoded = verifyToken(token);
  console.log(decoded.ID_ND);  // 1
} catch (error) {
  console.log(error.message);  // Token expired | Invalid token
}
```

---

## 3. Server Configuration (`server.js`)

### Purpose
Express server runtime configuration.

### Features

#### Port
```javascript
const serverConfig = require('../config/server');
const PORT = serverConfig.port;  // 5000
```

#### CORS
```javascript
const cors = require('cors');
app.use(cors(serverConfig.cors));

// Allows requests from CLIENT_URL
// Methods: GET, POST, PUT, DELETE, PATCH
// Headers: Content-Type, Authorization
```

#### Request Limits
- **Body Limit**: 10MB
- **Parameter Limit**: 50 parameters
- **Request Timeout**: 30 seconds

#### Rate Limiting (optional)
```javascript
// Configure express-rate-limit
const rateLimit = require('express-rate-limit');
const limiter = rateLimit(serverConfig.rateLimit);
// Max 100 requests per 15 minutes from single IP
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Development/production/test
- `CLIENT_URL`: Client origin for CORS (default: http://localhost:3000)

---

## 4. Email Configuration (`email.js`)

### Purpose
SMTP configuration cho nodemailer (nếu sử dụng email sending).

### SMTP Setup

#### Gmail Example
```javascript
// .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # Use App Password, not Gmail password
EMAIL_FROM=noreply@restaurant.com
```

#### Other Providers
- **SendGrid**: `smtp.sendgrid.net:587`
- **AWS SES**: `email-smtp.region.amazonaws.com:587`
- **Mailgun**: `smtp.mailgun.org:587`

### Email Templates

Các template có sẵn:

1. **Welcome Email**
   - Subject: Chào mừng đến với Quản Lý Nhà Hàng
   - Kích hoạt: Khi user đăng ký

2. **Email Verification**
   - Subject: Xác thực email của bạn
   - Kích hoạt: Sau khi đăng ký
   - Chứa: Verification link với token

3. **Password Reset**
   - Subject: Đặt lại mật khẩu
   - Kích hoạt: Khi user request reset password
   - Chứa: Reset link với token (15 phút)

4. **Order Confirmation**
   - Subject: Xác nhận hóa đơn
   - Kích hoạt: Khi hóa đơn được tạo
   - Chứa: Order details, items, total

5. **Payment Notification**
   - Subject: Thông báo thanh toán
   - Kích hoạt: Khi thanh toán hoàn tất
   - Chứa: Payment confirmation, receipt

### Usage

```javascript
const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/email');

const transporter = nodemailer.createTransport(emailConfig);

await transporter.sendMail({
  from: emailConfig.from,
  to: 'user@example.com',
  subject: 'Chào mừng',
  html: '<p>Welcome to Restaurant Management</p>'
});
```

---

## 5. Payment Configuration (`payment.js`)

### Purpose
Payment gateway configuration (Stripe, PayPal, Bank Transfer).

### Payment Methods

#### 1. Cash (Tiền mặt)
```javascript
{
  enabled: true,
  name: 'Tiền mặt',
  requiresAuth: false
}
```

#### 2. Card (Thẻ tín dụng - Stripe)
```javascript
const { payment } = require('../config/payment');
payment.methods.card
// Requires: STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY

// Usage
const stripe = require('stripe')(stripeConfig.secretKey);
const paymentIntent = await stripe.paymentIntents.create({
  amount: 100000,  // cents
  currency: 'vnd',
  metadata: { orderId: 123 }
});
```

#### 3. PayPal
```javascript
payment.methods.paypal
// Requires: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET

// Usage
const paypal = require('paypal-rest-sdk');
paypal.configure(paypalConfig);
```

#### 4. Bank Transfer
```javascript
payment.methods.transfer
// Bank info from environment variables
{
  bankName: 'Ngân hàng ABC',
  accountNumber: '1234567890',
  accountHolder: 'Restaurant Name',
  swiftCode: 'ABCVNVX'
}
```

#### 5. Mobile Wallet (Ví điện tử)
```javascript
payment.methods.mobile
// E-wallet payments
```

### Fee Calculation

```javascript
// Stripe: 2.9% + $0.30
const stripeFee = (amount * 0.029) + 0.30;

// PayPal: 2.2% + $0.30
const paypalFee = (amount * 0.022) + 0.30;
```

### Webhook Configuration

```javascript
// Stripe webhook for payment confirmations
const stripe = require('stripe')(stripeConfig.secretKey);

app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    stripeConfig.webhook.secret
  );
  // Handle event
});
```

---

## 6. Logging Configuration (`logging.js`)

### Purpose
Configure logging level, format, file output.

### Log Levels
1. **debug**: Detailed debugging information
2. **info**: General informational messages
3. **warn**: Warning messages
4. **error**: Error messages only

### Output Formats

#### Console
- Development: Colored output
- Production: JSON format

#### Files
- Location: `./logs` (configurable via `LOG_DIR`)
- Rotation: When file exceeds 20MB
- Retention: 14 files (14 days)
- Compression: Old files are gzipped

#### Database (optional)
- Table: `logs`
- Only errors logged

### Request Logging

```javascript
const morgan = require('morgan');
const { logConfig } = require('../config/logging');

app.use(morgan(logConfig.requests.format));
// Logs HTTP requests to console and/or file
```

### Error Logging

In development:
- Includes full stack trace
- Includes context (request details, etc.)

In production:
- Stack traces removed for security
- Error codes and messages only

### Usage

```javascript
const logger = require('../utils/logger');

logger.info('Server started', { port: 5000 });
logger.warn('High memory usage', { usage: '80%' });
logger.error('Database connection failed', { error: err });
logger.debug('Query executed', { query, result });
```

---

## 7. Configuration Index (`index.js`)

### Purpose
Export all configurations in one place for easy importing.

### Usage

```javascript
const config = require('../config');

// Database
const { sequelize, connectDB } = config.database;

// JWT
const jwtConfig = config.jwt;

// Server
const { port, cors } = config.server;

// Payment
const { payment } = config;

// Check environment
if (config.isDevelopment) {
  console.log('Development mode');
}
```

---

## 8. Environment Variables (.env.example)

### Template File
Copy `.env.example` to `.env` and fill in actual values.

```bash
cp .env.example .env
```

### Required Variables
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database
- `JWT_SECRET` - JWT signing key

### Optional Variables
- `EMAIL_*` - Email configuration
- `STRIPE_*` - Stripe API keys
- `PAYPAL_*` - PayPal API keys

### Security Notes
- Never commit `.env` to version control
- Keep `.env` in `.gitignore`
- Use strong `JWT_SECRET` in production
- Rotate payment API keys regularly
- Use environment-specific values (dev/test/prod)

---

## Configuration Flow in Application

```
1. Load dotenv (.env file)
   ↓
2. Validate required environment variables
   ↓
3. Create configuration objects
   ├─ database.js → Sequelize instance
   ├─ jwt.js → Token config
   ├─ server.js → Express config
   ├─ email.js → SMTP config
   ├─ payment.js → Payment config
   └─ logging.js → Logger config
   ↓
4. Export from config/index.js
   ↓
5. Use in app.js, server.js, and other modules
```

## Best Practices

1. **Never hardcode secrets** - Always use environment variables
2. **Validate required configs** - Check existence at startup
3. **Use meaningful defaults** - Provide sensible defaults for optional configs
4. **Environment-specific settings** - Different values for dev/prod
5. **Document all variables** - Keep .env.example updated
6. **Secure sensitive data** - Use strong encryption for passwords
7. **Version control** - Track .env.example but not .env
