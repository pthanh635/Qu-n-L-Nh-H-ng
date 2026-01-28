const { KhachHang, NguoiDung } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await KhachHang.findAndCountAll({
      include: ['khachhangInfo'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      order: [['DiemTichLuy', 'DESC']]
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach khach hang thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await KhachHang.findByPk(id, {
      include: ['khachhangInfo']
    });

    if (!customer) {
      throw ApiError.notFound('Khach hang khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', customer);
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { Ten, Email, MatKhau } = req.body;

    const { valid, errors } = validateRequired(
      { Ten, Email, MatKhau },
      ['Ten', 'Email', 'MatKhau']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    // Create user account
    const user = await NguoiDung.create({
      Ten,
      Email,
      MatKhau,
      VaiTro: 'khachhang',
      TrangThai: 'active'
    });

    // Create customer record
    const customer = await KhachHang.create({
      ID_ND: user.ID_ND,
      DiemTichLuy: 0,
      ChiTieu: 0
    });

    const customerWithUser = await KhachHang.findByPk(customer.ID_KH, {
      include: ['khachhangInfo']
    });

    sendCreated(res, customerWithUser, 'Tao khach hang thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Ten, Email, DiemTichLuy, ChiTieu } = req.body;

    const customer = await KhachHang.findByPk(id);
    if (!customer) {
      throw ApiError.notFound('Khach hang khong tim thay');
    }

    const updateData = {};
    if (DiemTichLuy !== undefined && DiemTichLuy >= 0) updateData.DiemTichLuy = DiemTichLuy;
    if (ChiTieu !== undefined && ChiTieu >= 0) updateData.ChiTieu = ChiTieu;

    await customer.update(updateData);

    // Update user info if needed
    if (Ten || Email) {
      const user = await NguoiDung.findByPk(customer.ID_ND);
      if (Ten) user.Ten = Ten;
      if (Email) user.Email = Email;
      await user.save();
    }

    const updated = await KhachHang.findByPk(id, {
      include: ['khachhangInfo']
    });

    sendSuccess(res, 200, 'Cap nhat khach hang thanh cong', updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await KhachHang.findByPk(id);
    if (!customer) {
      throw ApiError.notFound('Khach hang khong tim thay');
    }

    await NguoiDung.destroy({ where: { ID_ND: customer.ID_ND } });
    sendSuccess(res, 200, 'Xoa khach hang thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.getTopCustomers = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const topLimit = Math.min(parseInt(limit) || 10, 100);

    const customers = await KhachHang.findAll({
      include: ['khachhangInfo'],
      order: [['ChiTieu', 'DESC']],
      limit: topLimit
    });

    sendSuccess(res, 200, 'Lay danh sach khach hang chi tieu nhieu nhat thanh cong', customers);
  } catch (error) {
    next(error);
  }
};

exports.addLoyaltyPoints = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    if (!points || points < 0) {
      throw ApiError.badRequest('Diem phai lon hon 0');
    }

    const customer = await KhachHang.findByPk(id);
    if (!customer) {
      throw ApiError.notFound('Khach hang khong tim thay');
    }

    customer.DiemTichLuy += points;
    await customer.save();

    sendSuccess(res, 200, 'Cong diem thanh cong', customer);
  } catch (error) {
    next(error);
  }
};

exports.redeemLoyaltyPoints = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    if (!points || points < 0) {
      throw ApiError.badRequest('Diem phai lon hon 0');
    }

    const customer = await KhachHang.findByPk(id);
    if (!customer) {
      throw ApiError.notFound('Khach hang khong tim thay');
    }

    if (customer.DiemTichLuy < points) {
      throw ApiError.badRequest('Diem khong du');
    }

    customer.DiemTichLuy -= points;
    await customer.save();

    sendSuccess(res, 200, 'Dung diem thanh cong', customer);
  } catch (error) {
    next(error);
  }
};
