const { NguoiDung, NhanVien, KhachHang } = require('../models');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { generateTokenPair, verifyToken } = require('../utils/jwt');
const { sendSuccess, sendCreated, sendError, sendUnauthorized } = require('../utils/response');
const { isValidEmail, isValidPassword, validateRequired } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.register = async (req, res, next) => {
  try {
    // Accept both case variants
    const ten = req.body.Ten || req.body.ten;
    const email = req.body.Email || req.body.email;
    const password = req.body.MatKhau || req.body.password;
    const vaiTro = req.body.VaiTro || req.body.vaiTro || 'khachhang';

    // Validate required fields
    if (!ten || !email || !password) {
      return sendError(res, 400, 'Thiếu thông tin bắt buộc', { ten: !ten, email: !email, password: !password });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      throw ApiError.badRequest('Email khong hop le');
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      throw ApiError.badRequest('Mat khau phai co it nhat 6 ki tu');
    }

    // Check email exists
    const existingUser = await NguoiDung.findOne({ where: { Email: email } });
    if (existingUser) {
      throw ApiError.conflict('Email da ton tai');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await NguoiDung.create({
      Ten: ten,
      Email: email,
      MatKhau: hashedPassword,
      VaiTro: vaiTro || 'khachhang',
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
    const { accessToken, refreshToken } = generateTokenPair({
      ID_ND: user.ID_ND,
      Email: user.Email,
      VaiTro: user.VaiTro
    });

    sendCreated(res, {
      token: accessToken,
      refreshToken,
      user: { ID_ND: user.ID_ND, Ten: user.Ten, Email: user.Email, VaiTro: user.VaiTro }
    }, 'Dang ky thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Accept both email/Email and password/MatKhau for flexibility
    const email = req.body.email || req.body.Email;
    const password = req.body.password || req.body.MatKhau;

    // Validate required fields
    if (!email || !password) {
      return sendError(res, 400, 'Email và password không được để trống', { email: !email, password: !password });
    }

    // Find user
    const user = await NguoiDung.findOne({ where: { Email: email } });
    if (!user) {
      throw ApiError.unauthorized('Email hoặc mật khẩu sai');
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.MatKhau);
    if (!isMatch) {
      throw ApiError.unauthorized('Email hoặc mật khẩu sai');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair({
      ID_ND: user.ID_ND,
      Email: user.Email,
      VaiTro: user.VaiTro
    });

    sendSuccess(res, 200, 'Dang nhap thanh cong', {
      token: accessToken,
      refreshToken,
      user: { ID_ND: user.ID_ND, Ten: user.Ten, Email: user.Email, VaiTro: user.VaiTro }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'Dang xuat thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await NguoiDung.findByPk(req.user.ID_ND, {
      attributes: { exclude: ['MatKhau'] }
    });

    if (!user) {
      throw ApiError.notFound('Nguoi dung khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', user);
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const { valid, errors } = validateRequired({ oldPassword, newPassword }, ['oldPassword', 'newPassword']);
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidPassword(newPassword)) {
      throw ApiError.badRequest('Mat khau phai co it nhat 6 ki tu');
    }

    const user = await NguoiDung.findByPk(req.user.ID_ND);
    if (!user) {
      throw ApiError.notFound('Nguoi dung khong tim thay');
    }

    const isMatch = await verifyPassword(oldPassword, user.MatKhau);
    if (!isMatch) {
      throw ApiError.unauthorized('Mat khau cu khong chinh xac');
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({ MatKhau: hashedPassword });

    sendSuccess(res, 200, 'Thay doi mat khau thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { Email, VerifyCode } = req.body;

    const { valid, errors } = validateRequired({ Email, VerifyCode }, ['Email', 'VerifyCode']);
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    const user = await NguoiDung.findOne({ where: { Email } });
    if (!user) {
      throw ApiError.notFound('Nguoi dung khong tim thay');
    }

    sendSuccess(res, 200, 'Xac thuc email thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw ApiError.badRequest('Refresh token required');
    }

    const decoded = verifyToken(refreshToken);
    const user = await NguoiDung.findByPk(decoded.ID_ND);

    if (!user) {
      throw ApiError.notFound('Nguoi dung khong tim thay');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair({
      ID_ND: user.ID_ND,
      Email: user.Email,
      VaiTro: user.VaiTro
    });

    sendSuccess(res, 200, 'Refresh token thanh cong', {
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
};
