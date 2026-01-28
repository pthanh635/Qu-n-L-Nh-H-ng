/**
 * Model Index
 * File này export tất cả models từ associations
 * Luôn require file này SAU khi các associations được load
 */

const {
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
} = require('../associations');

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
