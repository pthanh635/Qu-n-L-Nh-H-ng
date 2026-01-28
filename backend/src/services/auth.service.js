const { NguoiDung, NhanVien, KhachHang } = require('../models');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { generateTokenPair } = require('../utils/jwt');
const ApiError = require('../utils/error');

class AuthService {
  async register(data) {
    const { Ten, Email, MatKhau, VaiTro } = data;

    // Check email exists
    const existingUser = await NguoiDung.findOne({ where: { Email } });
    if (existingUser) {
      throw ApiError.conflict('Email da ton tai');
    }

    // Hash password
    const hashedPassword = await hashPassword(MatKhau);

    // Create user
    const user = await NguoiDung.create({
      Ten,
      Email,
      MatKhau: hashedPassword,
      VaiTro: VaiTro || 'khachhang',
      TrangThai: 'active'
    });

    // If customer role, create KhachHang record
    if (user.VaiTro === 'khachhang') {
      await KhachHang.create({
        ID_ND: user.ID_ND,
        DiemTichLuy: 0
      });
    }

    // Generate tokens
    const tokens = generateTokenPair({
      ID_ND: user.ID_ND,
      Email: user.Email,
      VaiTro: user.VaiTro
    });

    return {
      user: { ID_ND: user.ID_ND, Ten: user.Ten, Email: user.Email, VaiTro: user.VaiTro },
      ...tokens
    };
  }

  async login(email, password) {
    // Find user
    const user = await NguoiDung.findOne({ where: { Email: email } });
    if (!user) {
      throw ApiError.unauthorized('Email hoac mat khau sai');
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.MatKhau);
    if (!isMatch) {
      throw ApiError.unauthorized('Email hoac mat khau sai');
    }

    // Generate tokens
    const tokens = generateTokenPair({
      ID_ND: user.ID_ND,
      Email: user.Email,
      VaiTro: user.VaiTro
    });

    return {
      user: { ID_ND: user.ID_ND, Ten: user.Ten, Email: user.Email, VaiTro: user.VaiTro },
      ...tokens
    };
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await NguoiDung.findByPk(userId);
    if (!user) {
      throw ApiError.notFound('Nguoi dung khong tim thay');
    }

    // Verify old password
    const isMatch = await verifyPassword(oldPassword, user.MatKhau);
    if (!isMatch) {
      throw ApiError.unauthorized('Mat khau cu khong chinh xac');
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword);
    await user.update({ MatKhau: hashedPassword });

    return { success: true };
  }
}

module.exports = new AuthService();
