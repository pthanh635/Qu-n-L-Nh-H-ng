# Restaurant Management System - Backend

Hệ thống quản lý nhà hàng Node.js + Express + Sequelize + MySQL

## 📋 Table of Contents

- [Tính Năng](#tính-năng)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)

## ✨ Tính Năng

### Authentication & Authorization
- ✅ Đăng ký, đăng nhập, đăng xuất
- ✅ JWT token authentication
- ✅ Role-based access control (Admin, Nhân Viên, Khách Hàng)
- ✅ Refresh token mechanism

### Quản Lý Người Dùng
- ✅ CRUD users (Admin only)
- ✅ Quản lý nhân viên với chức vụ
- ✅ Quản lý khách hàng với điểm tích lũy

### Quản Lý Menu
- ✅ CRUD danh mục món ăn
- ✅ CRUD món ăn với giá
- ✅ Tìm kiếm, lọc theo danh mục, khoảng giá
- ✅ Quản lý trạng thái món ăn

### Quản Lý Bàn Ăn
- ✅ CRUD bàn ăn
- ✅ Cập nhật trạng thái (trống, đang sử dụng, đã đặt)
- ✅ Xem bàn trống/đang sử dụng

### Quản Lý Hóa Đơn
- ✅ Tạo/cập nhật/xóa hóa đơn
- ✅ Thêm/xóa món ăn trong hóa đơn
- ✅ Áp dụng voucher giảm giá
- ✅ Thanh toán hóa đơn
- ✅ Hủy hóa đơn

### Quản Lý Kho
- ✅ Xem danh sách kho hàng
- ✅ Cập nhật số lượng
- ✅ Cảnh báo kho sắp hết/thừa hàng
- ✅ Thống kê giá trị kho

### Quản Lý Phiếu Nhập/Xuất
- ✅ CRUD phiếu nhập nguyên liệu
- ✅ CRUD phiếu xuất nguyên liệu
- ✅ Xác nhận nhập/xuất kho
- ✅ Lọc theo khoảng thời gian

### Quản Lý Voucher
- ✅ CRUD voucher
- ✅ Kiểm tra voucher hợp lệ
- ✅ Sử dụng/dùng voucher

### Thống Kê & Báo Cáo
- ✅ Dashboard tổng quan
- ✅ Doanh thu theo ngày/tuần/tháng
- ✅ Top 10 món bán chạy
- ✅ Top 10 khách hàng VIP
- ✅ Báo cáo lợi nhuận
- ✅ Báo cáo kho hàng
- ✅ Hiệu suất nhân viên

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2.1
- **Database**: MySQL 8.0+
- **ORM**: Sequelize 6.37.7
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Environment**: dotenv
- **CORS**: cors

## 📦 Installation

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm hoặc yarn

### Steps

1. **Clone repository**
```bash
git clone <repository-url>
cd restaurant-management/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create database**
```bash
mysql -u root -p
CREATE DATABASE QuanLyNhaHang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

4. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=QuanLyNhaHang

PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
```

5. **Seed database (optional)**
```bash
npm run seed
```

## ⚙️ Configuration

### Database Connection
Database config trong `src/config/database.js`:
- Host: localhost
- Port: 3306
- User: root
- Database: QuanLyNhaHang
- Timezone: +07:00 (Vietnam time)

### JWT Configuration
Token config trong `src/config/jwt.js`:
- Access Token: 1 day
- Refresh Token: 7 days
- Algorithm: HS256

### Server Configuration
Server config trong `src/config/server.js`:
- Port: 5000
- CORS: Enabled from http://localhost:3000

## 🚀 Usage

### Development Mode
```bash
npm run dev
```
Server chạy tại: http://localhost:5000

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

### Test
```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "Ten": "John Doe",
  "Email": "john@example.com",
  "MatKhau": "password123",
  "VaiTro": "khachhang"
}

Response: 201 Created
{
  "user": { "ID_ND": 1, "Ten": "John Doe", "Email": "john@example.com", "VaiTro": "khachhang" },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "Email": "admin@restaurant.com",
  "MatKhau": "admin123"
}

Response: 200 OK
{
  "user": { "ID_ND": 1, "Ten": "Admin", "Email": "admin@restaurant.com", "VaiTro": "admin" },
  "accessToken": "...",
  "refreshToken": "..."
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "ID_ND": 1,
  "Ten": "Admin",
  "Email": "admin@restaurant.com",
  "VaiTro": "admin"
}
```

### User Endpoints

#### Get All Users (Admin only)
```
GET /usuarios?page=1&limit=10&vaiTro=admin
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "data": [...],
  "pagination": { "total": 100, "page": 1, "limit": 10, "pages": 10, "hasNextPage": true }
}
```

#### Get User by ID
```
GET /usuarios/:id
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "ID_ND": 1,
  "Ten": "Admin",
  "Email": "admin@restaurant.com",
  "VaiTro": "admin"
}
```

#### Update User
```
PUT /usuarios/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "Ten": "New Name",
  "Email": "newemail@example.com"
}

Response: 200 OK
```

### Menu Endpoints

#### Get All Dishes
```
GET /menu?page=1&limit=10&trangThai=available
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "data": [
    { "ID_MonAn": 1, "TenMonAn": "Com Chien", "DonGia": 35000, "TrangThai": "available" }
  ],
  "pagination": {...}
}
```

#### Search Dishes
```
GET /menu/search?keyword=com
Authorization: Bearer <accessToken>

Response: 200 OK
```

### Invoice Endpoints

#### Create Invoice
```
POST /hoadon
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "ID_KH": 1,
  "ID_NV": 1,
  "ID_Ban": 1
}

Response: 201 Created
```

#### Add Item to Invoice
```
POST /hoadon/:invoiceId/items
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "ID_MonAn": 1,
  "SoLuong": 2
}

Response: 200 OK
```

#### Apply Voucher
```
POST /hoadon/:invoiceId/voucher
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "CodeVoucher": "GIAM10"
}

Response: 200 OK
```

#### Checkout
```
POST /hoadon/:invoiceId/checkout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "HinhThucThanhToan": "tien_mat"
}

Response: 200 OK
```

### Statistics Endpoints

#### Get Dashboard
```
GET /thongke/dashboard
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "totalRevenue": 5000000,
  "totalOrders": 150,
  "totalCustomers": 50,
  "totalStaff": 10
}
```

#### Get Daily Revenue
```
GET /thongke/revenue/daily?days=7
Authorization: Bearer <accessToken>

Response: 200 OK
[
  { "date": "2025-01-26", "revenue": 1000000, "orders": 30 },
  { "date": "2025-01-25", "revenue": 950000, "orders": 28 }
]
```

### Voucher Endpoints

#### Validate Voucher
```
POST /vouchers/validate
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "CodeVoucher": "GIAM10"
}

Response: 200 OK
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── associations/          # Model relationships
│   ├── config/                # Configuration files
│   │   ├── database.js        # MySQL config
│   │   ├── jwt.js             # JWT config
│   │   ├── server.js          # Server config
│   │   ├── email.js           # Email config
│   │   ├── payment.js         # Payment config
│   │   ├── logging.js         # Logging config
│   │   └── index.js           # Config aggregator
│   ├── controllers/           # Route handlers
│   ├── models/                # Sequelize models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── middlewares/           # Express middlewares
│   ├── utils/                 # Utility functions
│   ├── constants/             # Constants & enums
│   └── database/
│       └── seed.js            # Database seeding
├── docs/                      # Documentation
├── .env                       # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🗄️ Database Schema

### Main Tables

**NguoiDung (Users)**
- ID_ND (PK)
- Ten, Email, MatKhau, VaiTro, TrangThai

**NhanVien (Staff)**
- ID_NV (PK)
- ID_ND (FK), SDT, ChucVu, TinhTrang

**KhachHang (Customers)**
- ID_KH (PK)
- ID_ND (FK), DiemTichLuy, ChiTieu

**Ban (Tables)**
- ID_Ban (PK)
- TenBan, SoChoNgoi, ViTri, TrangThai

**DanhMuc (Categories)**
- ID_DanhMuc (PK)
- TenDanhMuc

**MonAn (Dishes)**
- ID_MonAn (PK)
- TenMonAn, DonGia, ID_DanhMuc, MoTa, TrangThai

**HoaDon (Invoices)**
- ID_HoaDon (PK)
- ID_KH, ID_NV, ID_Ban, TongTienMon, VAT, TienGiam, TongThanhToan, TrangThai

**CTHD (Invoice Details)**
- ID_CTHD (PK)
- ID_HoaDon, ID_MonAn, SoLuong, DonGia, ThanhTien

**Voucher**
- ID_Voucher (PK)
- CodeVoucher, TenVoucher, PhanTramGiam, SoLuong

**NguyenLieu (Ingredients)**
- ID_NguyenLieu (PK)
- TenNL, DonGia, DonViTinh

**Kho (Inventory)**
- ID_Kho (PK)
- ID_NguyenLieu, SLTon

**PhieuNhap (Import Orders)**
- ID_PhieuNhap (PK)
- ID_NV, NgayNhap, TongTien

**CTNhap (Import Details)**
- ID_CTNhap (PK)
- ID_PhieuNhap, ID_NguyenLieu, SoLuong, DonGia, ThanhTien

**PhieuXuat (Export Orders)**
- ID_PhieuXuat (PK)
- ID_NV, NgayXuat

**CTXuat (Export Details)**
- ID_CTXuat (PK)
- ID_PhieuXuat, ID_NguyenLieu, SoLuong

---

## 🧪 Test Credentials

Sau khi seed database:

```
Admin:
Email: admin@restaurant.com
Password: admin123

Staff:
Email: staff1@restaurant.com
Password: staff123

Customer:
Email: customer1@email.com
Password: customer123
```

---

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=QuanLyNhaHang

# JWT
JWT_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

ISC

---

## ✉️ Support

For issues, questions, or suggestions, please contact the development team.

---

**Last Updated**: January 2025
**Version**: 1.0.0
