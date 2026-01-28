const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import tất cả models
const NguoiDung = require('../models/NguoiDung')(sequelize, DataTypes);
const KhachHang = require('../models/KhachHang')(sequelize, DataTypes);
const NhanVien = require('../models/NhanVien')(sequelize, DataTypes);
const Ban = require('../models/Ban')(sequelize, DataTypes);
const DanhMuc = require('../models/DanhMuc')(sequelize, DataTypes);
const MonAn = require('../models/MonAn')(sequelize, DataTypes);
const HoaDon = require('../models/HoaDon')(sequelize, DataTypes);
const CTHD = require('../models/CTHD')(sequelize, DataTypes);
const Voucher = require('../models/Voucher')(sequelize, DataTypes);
const NguyenLieu = require('../models/NguyenLieu')(sequelize, DataTypes);
const Kho = require('../models/Kho')(sequelize, DataTypes);
const PhieuNhap = require('../models/PhieuNhap')(sequelize, DataTypes);
const CTNhap = require('../models/CTNhap')(sequelize, DataTypes);
const PhieuXuat = require('../models/PhieuXuat')(sequelize, DataTypes);
const CTXuat = require('../models/CTXuat')(sequelize, DataTypes);

// ============================================
// ASSOCIATIONS - THIẾT LẬP QUAN HỆ GIỮA CÁC MODELS
// ============================================

/**
 * NGƯỜI DÙNG & NHÂN VIÊN & KHÁCH HÀNG
 * - NguoiDung là parent của NhanVien và KhachHang
 * - 1 NguoiDung có thể là 1 NhanVien hoặc 1 KhachHang
 */
NguoiDung.hasOne(NhanVien, {
  foreignKey: 'ID_ND',
  as: 'nhanvienInfo'
});
NhanVien.belongsTo(NguoiDung, {
  foreignKey: 'ID_ND',
  as: 'nhanvienInfo'
});

NguoiDung.hasOne(KhachHang, {
  foreignKey: 'ID_ND',
  as: 'khachhangInfo'
});
KhachHang.belongsTo(NguoiDung, {
  foreignKey: 'ID_ND',
  as: 'khachhangInfo'
});

/**
 * DANH MỤC & MÓN ĂN
 * - 1 DanhMuc có nhiều MonAn
 * - 1 MonAn thuộc 1 DanhMuc
 */
DanhMuc.hasMany(MonAn, {
  foreignKey: 'ID_DanhMuc',
  as: 'monan'
});
MonAn.belongsTo(DanhMuc, {
  foreignKey: 'ID_DanhMuc',
  as: 'danhMuc'
});

/**
 * HÓA ĐƠN
 * - 1 KhachHang có nhiều HoaDon
 * - 1 NhanVien (tạo) có nhiều HoaDon
 * - 1 Ban có nhiều HoaDon
 */
KhachHang.hasMany(HoaDon, {
  foreignKey: 'ID_KH',
  as: 'hoadon'
});
HoaDon.belongsTo(KhachHang, {
  foreignKey: 'ID_KH',
  as: 'khachhang'
});

NhanVien.hasMany(HoaDon, {
  foreignKey: 'ID_NV',
  as: 'hoadon'
});
HoaDon.belongsTo(NhanVien, {
  foreignKey: 'ID_NV',
  as: 'nhanvien'
});

Ban.hasMany(HoaDon, {
  foreignKey: 'ID_Ban',
  as: 'hoadon'
});
HoaDon.belongsTo(Ban, {
  foreignKey: 'ID_Ban',
  as: 'ban'
});

/**
 * CHI TIẾT HÓA ĐƠN (CTHD)
 * - 1 HoaDon có nhiều CTHD
 * - 1 MonAn có nhiều CTHD
 * - CTHD là junction table với foreign keys: ID_HoaDon, ID_MonAn
 */
HoaDon.hasMany(CTHD, {
  foreignKey: 'ID_HoaDon',
  as: 'chitiethoadon'
});
CTHD.belongsTo(HoaDon, {
  foreignKey: 'ID_HoaDon',
  as: 'hoadon'
});

MonAn.hasMany(CTHD, {
  foreignKey: 'ID_MonAn',
  as: 'chitiethoadon'
});
CTHD.belongsTo(MonAn, {
  foreignKey: 'ID_MonAn',
  as: 'monan'
});

/**
 * VOUCHER & HÓA ĐƠN
 * - 1 Voucher có thể được dùng trong nhiều HoaDon
 */
Voucher.hasMany(HoaDon, {
  foreignKey: 'CodeVoucher',
  as: 'hoadon'
});
HoaDon.belongsTo(Voucher, {
  foreignKey: 'CodeVoucher',
  as: 'voucher'
});

/**
 * NGUYÊN LIỆU & KHO
 * - 1 NguyenLieu có 1 bản ghi Kho (quản lý số lượng tồn)
 * - Kho track số lượng tồn của mỗi NguyenLieu
 */
NguyenLieu.hasOne(Kho, {
  foreignKey: 'ID_NL',
  as: 'kho'
});
Kho.belongsTo(NguyenLieu, {
  foreignKey: 'ID_NL',
  as: 'nguyenLieu'
});

/**
 * PHIẾU NHẬP & CHI TIẾT NHẬP
 * - 1 PhieuNhap có nhiều CTNhap
 * - 1 NhanVien tạo nhiều PhieuNhap
 * - 1 NguyenLieu có thể xuất hiện trong nhiều CTNhap
 */
NhanVien.hasMany(PhieuNhap, {
  foreignKey: 'ID_NV',
  as: 'phieunhap'
});
PhieuNhap.belongsTo(NhanVien, {
  foreignKey: 'ID_NV',
  as: 'nhanVien'
});

PhieuNhap.hasMany(CTNhap, {
  foreignKey: 'ID_NK',
  as: 'chiTietNhap'
});
CTNhap.belongsTo(PhieuNhap, {
  foreignKey: 'ID_NK',
  as: 'phieunhap'
});

NguyenLieu.hasMany(CTNhap, {
  foreignKey: 'ID_NL',
  as: 'chitietnhap'
});
CTNhap.belongsTo(NguyenLieu, {
  foreignKey: 'ID_NL',
  as: 'nguyenlieu'
});

/**
 * PHIẾU XUẤT & CHI TIẾT XUẤT
 * - 1 PhieuXuat có nhiều CTXuat
 * - 1 NhanVien tạo nhiều PhieuXuat
 * - 1 NguyenLieu có thể xuất hiện trong nhiều CTXuat
 */
NhanVien.hasMany(PhieuXuat, {
  foreignKey: 'ID_NV',
  as: 'phieuxuat'
});
PhieuXuat.belongsTo(NhanVien, {
  foreignKey: 'ID_NV',
  as: 'nhanVien'
});

PhieuXuat.hasMany(CTXuat, {
  foreignKey: 'ID_XK',
  as: 'chiTietXuat'
});
CTXuat.belongsTo(PhieuXuat, {
  foreignKey: 'ID_XK',
  as: 'phieuxuat'
});

NguyenLieu.hasMany(CTXuat, {
  foreignKey: 'ID_NL',
  as: 'chitietxuat'
});
CTXuat.belongsTo(NguyenLieu, {
  foreignKey: 'ID_NL',
  as: 'nguyenlieu'
});

// ============================================
// EXPORT CÁC MODELS & SEQUELIZE
// ============================================

module.exports = {
  sequelize,
  NguoiDung,
  KhachHang,
  NhanVien,
  Ban,
  DanhMuc,
  MonAn,
  HoaDon,
  CTHD,
  Voucher,
  NguyenLieu,
  Kho,
  PhieuNhap,
  CTNhap,
  PhieuXuat,
  CTXuat,
};
