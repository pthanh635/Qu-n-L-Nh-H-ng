# Hướng Dẫn Sử Dụng Models

## Overview

Tất cả models được định nghĩa dưới dạng factory functions trong `src/models/` folder. Associations (quan hệ giữa models) được load tập trung tại `src/associations/index.js`.

## Import Models

### Cách 1: Import từ associations (Recommended)
```javascript
const { NguoiDung, HoaDon, MonAn } = require('../models');
// hoặc
const models = require('../models');
```

### Cách 2: Import từ associations/index.js
```javascript
const { sequelize, NguoiDung, KhachHang } = require('../associations');
```

## Các Models Chính

### 1. NguoiDung (Người Dùng)
```javascript
const { NguoiDung } = require('../models');

// Tạo người dùng mới
const user = await NguoiDung.create({
  Ten: 'Nguyễn Văn A',
  Email: 'user@example.com',
  MatKhau: hashedPassword,
  VaiTro: 'khachhang', // admin | nhanvien | khachhang
  TrangThai: 'active'
});

// Tìm theo email
const user = await NguoiDung.findOne({ where: { Email: 'user@example.com' } });

// Lấy kèm thông tin nhân viên hoặc khách hàng
const user = await NguoiDung.findByPk(id, {
  include: ['nhanvienInfo', 'khachhangInfo']
});
```

### 2. NhanVien (Nhân Viên)
```javascript
const { NhanVien } = require('../models');

// Tạo nhân viên (khi tạo user với VaiTro = 'nhanvien')
const nhanvien = await NhanVien.create({
  ID_ND: nguoidung.ID_ND,
  NgayVaoLam: new Date(),
  SDT: '0912345678',
  ChucVu: 'phục vụ',
  TinhTrang: 'dang_lam'
});

// Lấy kèm info người dùng
const nhanvien = await NhanVien.findByPk(id, {
  include: ['nguoidungInfo']
});

// Lấy danh sách hóa đơn của nhân viên
const nhanvien = await NhanVien.findByPk(id, {
  include: [{ association: 'hoadonList', as: 'hoadonList' }]
});
```

### 3. KhachHang (Khách Hàng)
```javascript
const { KhachHang } = require('../models');

// Tạo khách hàng
const khachhang = await KhachHang.create({
  ID_ND: nguoidung.ID_ND,
  NgayThamGia: new Date(),
  ChiTieu: 0,
  DiemTichLuy: 0
});

// Lấy thông tin khách hàng kèm hóa đơn
const khachhang = await KhachHang.findByPk(id, {
  include: ['nguoidungInfo', 'hoadonList']
});

// Cập nhật điểm tích lũy
await khachhang.update({ DiemTichLuy: khachhang.DiemTichLuy + 100 });
```

### 4. DanhMuc & MonAn
```javascript
const { DanhMuc, MonAn } = require('../models');

// Tạo danh mục
const danhmuc = await DanhMuc.create({
  TenDanhMuc: 'Cơm',
  MoTa: 'Các món cơm chính'
});

// Tạo món ăn
const monan = await MonAn.create({
  TenMonAn: 'Cơm tấm thịt nướng',
  DonGia: 45000,
  MoTa: 'Cơm tấm chín với thịt nướng',
  ID_DanhMuc: danhmuc.ID_DanhMuc,
  TrangThai: 'available'
});

// Lấy danh mục kèm danh sách món
const danhmuc = await DanhMuc.findByPk(id, {
  include: ['monanList']
});

// Lấy món ăn kèm danh mục
const monan = await MonAn.findByPk(id, {
  include: ['danhmuc']
});
```

### 5. HoaDon & CTHD
```javascript
const { HoaDon, CTHD } = require('../models');

// Tạo hóa đơn mới (trạng thái = 'dang_mo')
const hoadon = await HoaDon.create({
  ID_KH: khachhang.ID_KH,
  ID_NV: nhanvien.ID_NV,
  ID_Ban: ban.ID_Ban,
  NgayHD: new Date(),
  TrangThai: 'dang_mo',
  TongTienMon: 0,
  VAT: 0,
  TienGiam: 0,
  TongThanhToan: 0
});

// Thêm chi tiết hóa đơn
const cthd = await CTHD.create({
  ID_HoaDon: hoadon.ID_HoaDon,
  ID_MonAn: monan.ID_MonAn,
  SoLuong: 2,
  DonGia: 45000,
  ThanhTien: 90000,
  GhiChu: 'Không ớt'
});

// Lấy hóa đơn kèm chi tiết
const hoadon = await HoaDon.findByPk(id, {
  include: ['khachhang', 'nhanvien', 'ban', 'chitiethoadon']
});

// Lấy chi tiết hóa đơn kèm thông tin món ăn
const cthd = await CTHD.findAll({
  where: { ID_HoaDon: id },
  include: ['monan']
});
```

### 6. Kho, NguyenLieu
```javascript
const { Kho, NguyenLieu } = require('../models');

// Tạo nguyên liệu
const nl = await NguyenLieu.create({
  TenNL: 'Gạo Thái',
  DonGia: 15000,
  DonViTinh: 'kg'
});

// Tạo bản ghi kho cho nguyên liệu
const kho = await Kho.create({
  ID_NL: nl.ID_NL,
  SLTon: 100
});

// Lấy thông tin kho kèm nguyên liệu
const kho = await Kho.findByPk(nlId, {
  include: ['nguyenlieu']
});

// Cập nhật số lượng tồn
await kho.update({ SLTon: kho.SLTon + 50 });
```

### 7. PhieuNhap, CTNhap
```javascript
const { PhieuNhap, CTNhap } = require('../models');

// Tạo phiếu nhập
const pn = await PhieuNhap.create({
  ID_NV: nhanvien.ID_NV,
  NgayNhap: new Date(),
  TongTien: 0
});

// Thêm chi tiết nhập
const ctnhap = await CTNhap.create({
  ID_NK: pn.ID_NK,
  ID_NL: nl.ID_NL,
  SoLuong: 100,
  DonGia: 15000,
  ThanhTien: 1500000
});

// Lấy phiếu nhập kèm chi tiết
const pn = await PhieuNhap.findByPk(id, {
  include: ['nhanvien', 'chitietnhap']
});

// Cập nhật tổng tiền phiếu nhập
const chiTiet = await CTNhap.findAll({ where: { ID_NK: id } });
const tongTien = chiTiet.reduce((sum, ct) => sum + parseFloat(ct.ThanhTien), 0);
await pn.update({ TongTien: tongTien });
```

### 8. Voucher
```javascript
const { Voucher } = require('../models');

// Tạo voucher
const voucher = await Voucher.create({
  CodeVoucher: 'SALE10',
  MoTa: 'Giảm 10% cho tất cả đơn',
  PhanTramGiam: 10,
  SoLuong: 100,
  DiemDoi: 50
});

// Tìm voucher
const voucher = await Voucher.findByPk('SALE10');

// Tính tiền giảm
const tienGiam = (hoadon.TongTienMon * voucher.PhanTramGiam) / 100;

// Giảm số lượng voucher còn lại
await voucher.update({ SoLuong: voucher.SoLuong - 1 });
```

## Associations (Quan Hệ)

### Cách sử dụng include
```javascript
// Lấy kèm một association
const user = await NguoiDung.findByPk(id, {
  include: ['nhanvienInfo']
});

// Lấy kèm nhiều associations
const nhanvien = await NhanVien.findByPk(id, {
  include: ['nguoidungInfo', 'hoadonList', 'phieunhapList']
});

// Lấy kèm nested associations
const hoadon = await HoaDon.findByPk(id, {
  include: [
    { association: 'khachhang', include: ['nguoidungInfo'] },
    { association: 'chitiethoadon', include: ['monan'] }
  ]
});
```

### Danh sách Associations
```
NguoiDung:
  - nhanvienInfo (1:1)
  - khachhangInfo (1:1)

NhanVien:
  - nguoidungInfo (belongs to NguoiDung)
  - hoadonList (1:n)
  - phieunhapList (1:n)
  - phieuxuatList (1:n)

KhachHang:
  - nguoidungInfo (belongs to NguoiDung)
  - hoadonList (1:n)

DanhMuc:
  - monanList (1:n)

MonAn:
  - danhmuc (belongs to DanhMuc)
  - chitiethoadon (1:n)

HoaDon:
  - khachhang (belongs to KhachHang)
  - nhanvien (belongs to NhanVien)
  - ban (belongs to Ban)
  - chitiethoadon (1:n)
  - voucher (belongs to Voucher)

CTHD:
  - hoadon (belongs to HoaDon)
  - monan (belongs to MonAn)

Kho:
  - nguyenlieu (belongs to NguyenLieu)

NguyenLieu:
  - khoInfo (1:1)
  - chitietnhap (1:n)
  - chitietxuat (1:n)

PhieuNhap:
  - nhanvien (belongs to NhanVien)
  - chitietnhap (1:n)

CTNhap:
  - phieunhap (belongs to PhieuNhap)
  - nguyenlieu (belongs to NguyenLieu)

PhieuXuat:
  - nhanvien (belongs to NhanVien)
  - chitietxuat (1:n)

CTXuat:
  - phieuxuat (belongs to PhieuXuat)
  - nguyenlieu (belongs to NguyenLieu)
```

## Transactions (Giao Dịch)

```javascript
const { sequelize } = require('../models');

const transaction = await sequelize.transaction();

try {
  // Tạo hóa đơn
  const hoadon = await HoaDon.create({...}, { transaction });
  
  // Tạo chi tiết
  await CTHD.create({...}, { transaction });
  
  // Cập nhật kho
  await Kho.update({...}, { transaction });
  
  // Commit transaction
  await transaction.commit();
} catch (error) {
  // Rollback nếu lỗi
  await transaction.rollback();
  throw error;
}
```

## Validation & Error Handling

Các models có built-in validations:
```javascript
try {
  const user = await NguoiDung.create({
    Email: 'invalid-email',
    MatKhau: 'short' // ngắn
  });
} catch (error) {
  // error.name = 'SequelizeValidationError'
  console.log(error.errors); // Chi tiết validation errors
}
```

## Tips & Best Practices

1. **Luôn load associations sau khi tạo models** - Tất cả associations được load trong `server.js`
2. **Dùng transactions cho multi-step operations** - Đảm bảo data consistency
3. **Include relations khi cần dữ liệu liên quan** - Tránh N+1 queries
4. **Validate input trước khi lưu database**
5. **Sử dụng hooks với cẫn thận** - Đặt trong services, không trong models
