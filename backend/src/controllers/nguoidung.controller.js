const { NguoiDung } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidEmail } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, vaiTro } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = {};
    if (vaiTro) where.VaiTro = vaiTro;

    const { count, rows } = await NguoiDung.findAndCountAll({
      where,
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      attributes: { exclude: ['MatKhau'] }
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check own user or admin
    if (req.user.ID_ND !== parseInt(id) && req.user.VaiTro !== 'admin') {
      throw ApiError.forbidden('Khong co quyen truy cap');
    }

    const user = await NguoiDung.findByPk(id, {
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

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Ten, Email, TrangThai, VaiTro } = req.body;

    // Check own user or admin
    if (req.user.ID_ND !== parseInt(id) && req.user.VaiTro !== 'admin') {
      throw ApiError.forbidden('Khong co quyen truy cap');
    }

    const user = await NguoiDung.findByPk(id);
    if (!user) {
      throw ApiError.notFound('Nguoi dung khong tim thay');
    }

    // Only admin can change role and status
    if ((TrangThai || VaiTro) && req.user.VaiTro !== 'admin') {
      throw ApiError.forbidden('Chi admin co the doi TrangThai hoac VaiTro');
    }

    // Check email unique if changed
    if (Email && Email !== user.Email) {
      if (!isValidEmail(Email)) {
        throw ApiError.badRequest('Email khong hop le');
      }
      const existingUser = await NguoiDung.findOne({ where: { Email } });
      if (existingUser) {
        throw ApiError.conflict('Email da ton tai');
      }
    }

    const updateData = {};
    if (Ten) updateData.Ten = Ten;
    if (Email) updateData.Email = Email;
    if (TrangThai && req.user.VaiTro === 'admin') updateData.TrangThai = TrangThai;
    if (VaiTro && req.user.VaiTro === 'admin') updateData.VaiTro = VaiTro;

    await user.update(updateData);

    sendSuccess(res, 200, 'Cap nhat thanh cong', {
      ...user.toJSON(),
      MatKhau: undefined
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await NguoiDung.findByPk(id);
    if (!user) {
      throw ApiError.notFound('Nguoi dung khong tim thay');
    }

    await user.destroy();
    sendSuccess(res, 200, 'Xoa nguoi dung thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.getStaffList = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await NguoiDung.findAndCountAll({
      where: { VaiTro: 'nhanvien' },
      include: ['nhanvienInfo'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      attributes: { exclude: ['MatKhau'] }
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach nhan vien thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getCustomerList = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await NguoiDung.findAndCountAll({
      where: { VaiTro: 'khachhang' },
      include: ['khachhangInfo'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      attributes: { exclude: ['MatKhau'] }
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach khach hang thanh cong');
  } catch (error) {
    next(error);
  }
};
