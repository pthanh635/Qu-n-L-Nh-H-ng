# API Routes Documentation

Tài liệu đầy đủ về các API endpoints của hệ thống quản lý nhà hàng.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Hầu hết các endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/login` | Đăng nhập | ❌ |
| POST | `/logout` | Đăng xuất | ✅ |
| GET | `/me` | Lấy thông tin user hiện tại | ✅ |
| POST | `/verify-email` | Xác nhận email | ❌ |
| POST | `/change-password` | Thay đổi mật khẩu | ✅ |
| POST | `/refresh-token` | Refresh JWT token | ❌ |

### 2. Người Dùng (`/usuarios`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Lấy danh sách người dùng | ✅ Admin |
| GET | `/:id` | Lấy thông tin 1 người dùng | ✅ |
| PUT | `/:id` | Cập nhật người dùng | ✅ |
| DELETE | `/:id` | Xóa người dùng | ✅ Admin |
| GET | `/staff/list` | Danh sách nhân viên | ✅ |
| GET | `/customers/list` | Danh sách khách hàng | ✅ |

### 3. Nhân Viên (`/nhanvien`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách nhân viên | ✅ Admin |
| GET | `/:id` | Thông tin 1 nhân viên | ✅ |
| POST | `/` | Tạo nhân viên mới | ✅ Admin |
| PUT | `/:id` | Cập nhật nhân viên | ✅ |
| DELETE | `/:id` | Xóa nhân viên | ✅ Admin |
| GET | `/status/active` | Danh sách nhân viên hoạt động | ✅ |
| PATCH | `/:id/status` | Cập nhật trạng thái | ✅ Admin |

### 4. Khách Hàng (`/khachhang`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách khách hàng | ✅ Admin/Staff |
| GET | `/:id` | Thông tin 1 khách hàng | ✅ |
| PUT | `/:id` | Cập nhật khách hàng | ✅ |
| DELETE | `/:id` | Xóa khách hàng | ✅ Admin |
| GET | `/stats/top-spenders` | Khách chi tiêu cao nhất | ✅ Admin |
| POST | `/:id/loyalty-points/add` | Cộng điểm | ✅ Staff |
| POST | `/:id/loyalty-points/redeem` | Sử dụng điểm | ✅ |
| GET | `/:id/invoices` | Lịch sử hóa đơn | ✅ |

### 5. Bàn Ăn (`/ban`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách bàn | ✅ |
| GET | `/:id` | Thông tin 1 bàn | ✅ |
| POST | `/` | Tạo bàn mới | ✅ Admin |
| PUT | `/:id` | Cập nhật bàn | ✅ Admin |
| DELETE | `/:id` | Xóa bàn | ✅ Admin |
| PATCH | `/:id/status` | Cập nhật trạng thái | ✅ Staff |
| GET | `/status/available` | Bàn trống | ✅ |
| GET | `/status/in-use` | Bàn đang sử dụng | ✅ Staff |

### 6. Món Ăn (`/monan`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách món | ❌ |
| GET | `/:id` | Thông tin 1 món | ❌ |
| GET | `/search/by-name` | Tìm kiếm món | ❌ |
| GET | `/category/:categoryId` | Món theo danh mục | ❌ |
| POST | `/` | Tạo món mới | ✅ Admin |
| PUT | `/:id` | Cập nhật món | ✅ Admin |
| DELETE | `/:id` | Xóa món | ✅ Admin |
| PATCH | `/:id/status` | Cập nhật trạng thái | ✅ Admin |
| PATCH | `/:id/price` | Cập nhật giá | ✅ Admin |
| GET | `/availability/available` | Món có sẵn | ❌ |
| GET | `/price/range` | Món theo khoảng giá | ❌ |

### 7. Hóa Đơn (`/hoadon`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách hóa đơn | ✅ Staff |
| GET | `/:id` | Thông tin 1 hóa đơn | ✅ |
| POST | `/` | Tạo hóa đơn | ✅ Staff |
| PUT | `/:id` | Cập nhật hóa đơn | ✅ Staff |
| POST | `/:id/checkout` | Thanh toán | ✅ Staff |
| POST | `/:id/cancel` | Hủy hóa đơn | ✅ |
| DELETE | `/:id` | Xóa hóa đơn | ✅ Admin |
| GET | `/:id/items` | Items trong hóa đơn | ✅ |
| POST | `/:id/items` | Thêm món | ✅ Staff |
| PUT | `/:id/items/:dishId` | Cập nhật số lượng | ✅ Staff |
| DELETE | `/:id/items/:dishId` | Xóa món | ✅ Staff |
| POST | `/:id/apply-voucher` | Áp dụng voucher | ✅ Staff |

### 8. Voucher (`/voucher`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/validate/:code` | Kiểm tra voucher | ❌ |
| GET | `/` | Danh sách voucher | ✅ Staff |
| GET | `/:code` | Thông tin 1 voucher | ✅ |
| POST | `/` | Tạo voucher | ✅ Admin |
| PUT | `/:code` | Cập nhật voucher | ✅ Admin |
| DELETE | `/:code` | Xóa voucher | ✅ Admin |
| PATCH | `/:code/quantity` | Cập nhật số lượng | ✅ Admin |
| PATCH | `/:code/use` | Sử dụng voucher | ✅ Staff |
| GET | `/status/available` | Voucher còn hàng | ✅ |

### 9. Kho (`/kho`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách kho | ✅ Staff |
| GET | `/:id` | Thông tin 1 nguyên liệu | ✅ Staff |
| PUT | `/:id` | Cập nhật số lượng | ✅ Admin |
| GET | `/status/low-stock` | Hàng sắp hết | ✅ Admin |
| GET | `/status/overstock` | Hàng thừa | ✅ Admin |
| GET | `/reports/stock-report` | Báo cáo kho | ✅ Admin |

### 10. Phiếu Nhập (`/phieunhap`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách phiếu nhập | ✅ Staff |
| GET | `/:id` | Thông tin 1 phiếu | ✅ Staff |
| POST | `/` | Tạo phiếu nhập | ✅ Staff |
| PUT | `/:id` | Cập nhật phiếu | ✅ Staff |
| POST | `/:id/confirm` | Xác nhận phiếu | ✅ Admin |
| DELETE | `/:id` | Xóa phiếu | ✅ Admin |
| GET | `/:id/items` | Items trong phiếu | ✅ Staff |
| POST | `/:id/items` | Thêm nguyên liệu | ✅ Staff |
| PUT | `/:id/items/:materialId` | Cập nhật item | ✅ Staff |
| DELETE | `/:id/items/:materialId` | Xóa item | ✅ Staff |
| GET | `/reports/by-date` | Báo cáo theo ngày | ✅ Admin |
| GET | `/reports/cost` | Báo cáo chi phí | ✅ Admin |

### 11. Phiếu Xuất (`/phieuxuat`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Danh sách phiếu xuất | ✅ Staff |
| GET | `/:id` | Thông tin 1 phiếu | ✅ Staff |
| POST | `/` | Tạo phiếu xuất | ✅ Staff |
| PUT | `/:id` | Cập nhật phiếu | ✅ Staff |
| POST | `/:id/confirm` | Xác nhận phiếu | ✅ Admin |
| DELETE | `/:id` | Xóa phiếu | ✅ Admin |
| GET | `/:id/items` | Items trong phiếu | ✅ Staff |
| POST | `/:id/items` | Thêm nguyên liệu | ✅ Staff |
| PUT | `/:id/items/:materialId` | Cập nhật item | ✅ Staff |
| DELETE | `/:id/items/:materialId` | Xóa item | ✅ Staff |
| GET | `/reports/by-date` | Báo cáo theo ngày | ✅ Admin |
| GET | `/reports/export` | Báo cáo xuất hàng | ✅ Admin |

### 12. Thống Kê (`/thongke`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard/today` | Dashboard hôm nay | ✅ Admin |
| GET | `/dashboard/month` | Dashboard tháng | ✅ Admin |
| GET | `/dashboard/year` | Dashboard năm | ✅ Admin |
| GET | `/revenue/total` | Tổng doanh thu | ✅ Admin |
| GET | `/revenue/daily` | Doanh thu ngày | ✅ Admin |
| GET | `/revenue/weekly` | Doanh thu tuần | ✅ Admin |
| GET | `/revenue/monthly` | Doanh thu tháng | ✅ Admin |
| GET | `/invoices/count` | Số lượng hóa đơn | ✅ Admin |
| GET | `/dishes/top-selling` | Món bán chạy | ✅ Admin |
| GET | `/dishes/slow-selling` | Món bán chậm | ✅ Admin |
| GET | `/categories/top` | Danh mục bán chạy | ✅ Admin |
| GET | `/customers/top-spenders` | Khách chi tiêu cao | ✅ Admin |
| GET | `/customers/new` | Khách hàng mới | ✅ Admin |
| GET | `/staff/top-revenue` | Nhân viên bán chạy | ✅ Admin |
| GET | `/payment-methods/breakdown` | Phân bố thanh toán | ✅ Admin |
| GET | `/costs/import` | Chi phí nhập | ✅ Admin |
| GET | `/profit/total` | Tổng lợi nhuận | ✅ Admin |
| GET | `/profit/daily` | Lợi nhuận ngày | ✅ Admin |
| GET | `/export/excel` | Xuất Excel | ✅ Admin |
| GET | `/export/pdf` | Xuất PDF | ✅ Admin |

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "id": 1,
    "name": "..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "error": {}
}
```

## Common Query Parameters

- `page` - Trang (default: 1)
- `limit` - Số item/trang (default: 10)
- `sortBy` - Cột sắp xếp (default: id)
- `order` - ASC | DESC (default: DESC)
- `fromDate` - Từ ngày (format: YYYY-MM-DD)
- `toDate` - Đến ngày (format: YYYY-MM-DD)

## Authorization Levels

- **Public**: Không cần token
- **All Users**: Cần token (bất kỳ role nào)
- **Staff**: Yêu cầu role = nhanvien hoặc admin
- **Admin**: Yêu cầu role = admin

## Rate Limiting

Hiện tại không có rate limiting. Sẽ được thêm sau.

## Changelog

- v1.0 - Initial release (12/26/2025)
