const { NhanVien, NguoiDung } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidPhone } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllStaff = async (req, res, next) => {
  try {
    const { page, limit, tinhTrang } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = {};
    if (tinhTrang) where.TinhTrang = tinhTrang;

    const { count, rows } = await NhanVien.findAndCountAll({
      where,
      include: ['nhanvienInfo'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach nhan vien thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getStaffById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const staff = await NhanVien.findByPk(id, {
      include: ['nhanvienInfo']
    });

    if (!staff) {
      throw ApiError.notFound('Nhan vien khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', staff);
  } catch (error) {
    next(error);
  }
};

exports.createStaff = async (req, res, next) => {
  try {
    const { Ten, Email, MatKhau, SDT, ChucVu } = req.body;

    const { valid, errors } = validateRequired(
      { Ten, Email, MatKhau, SDT, ChucVu },
      ['Ten', 'Email', 'MatKhau', 'SDT', 'ChucVu']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidPhone(SDT)) {
      throw ApiError.badRequest('So dien thoai khong hop le');
    }

    // Create user account
    const user = await NguoiDung.create({
      Ten,
      Email,
      MatKhau,
      VaiTro: 'nhanvien',
      TrangThai: 'active'
    });

    // Create staff record
    const staff = await NhanVien.create({
      ID_ND: user.ID_ND,
      SDT,
      ChucVu,
      TinhTrang: 'dang_lam'
    });

    const staffWithUser = await NhanVien.findByPk(staff.ID_NV, {
      include: ['nhanvienInfo']
    });

    sendCreated(res, staffWithUser, 'Tao nhan vien thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Ten, Email, SDT, ChucVu, TinhTrang } = req.body;

    const staff = await NhanVien.findByPk(id);
    if (!staff) {
      throw ApiError.notFound('Nhan vien khong tim thay');
    }

    if (SDT && !isValidPhone(SDT)) {
      throw ApiError.badRequest('So dien thoai khong hop le');
    }

    const updateData = {};
    if (SDT) updateData.SDT = SDT;
    if (ChucVu) updateData.ChucVu = ChucVu;
    if (TinhTrang) updateData.TinhTrang = TinhTrang;

    await staff.update(updateData);

    // Update user info if needed
    if (Ten || Email) {
      const user = await NguoiDung.findByPk(staff.ID_ND);
      if (Ten) user.Ten = Ten;
      if (Email) user.Email = Email;
      await user.save();
    }

    const updated = await NhanVien.findByPk(id, {
      include: ['nhanvienInfo']
    });

    sendSuccess(res, 200, 'Cap nhat nhan vien thanh cong', updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const staff = await NhanVien.findByPk(id);
    if (!staff) {
      throw ApiError.notFound('Nhan vien khong tim thay');
    }

    await NguoiDung.destroy({ where: { ID_ND: staff.ID_ND } });
    sendSuccess(res, 200, 'Xoa nhan vien thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.getActiveStaff = async (req, res, next) => {
  try {
    const staff = await NhanVien.findAll({
      where: { TinhTrang: 'dang_lam' },
      include: ['nhanvienInfo']
    });

    sendSuccess(res, 200, 'Lay danh sach nhan vien hoat dong thanh cong', staff);
  } catch (error) {
    next(error);
  }
};

exports.updateStaffStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TinhTrang } = req.body;

    if (!TinhTrang) {
      throw ApiError.badRequest('TinhTrang la bat buoc');
    }

    const staff = await NhanVien.findByPk(id);
    if (!staff) {
      throw ApiError.notFound('Nhan vien khong tim thay');
    }

    await staff.update({ TinhTrang });
    sendSuccess(res, 200, 'Cap nhat trang thai thanh cong', staff);
  } catch (error) {
    next(error);
  }
};
