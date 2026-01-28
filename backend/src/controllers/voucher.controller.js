const { Voucher } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidPercentage, isValidNumber } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllVouchers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await Voucher.findAndCountAll({
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach voucher thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getVoucherById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw ApiError.notFound('Voucher khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', voucher);
  } catch (error) {
    next(error);
  }
};

exports.createVoucher = async (req, res, next) => {
  try {
    const { CodeVoucher, TenVoucher, PhanTramGiam, SoLuong, DiemDoi, NgayHetHan } = req.body;

    const { valid, errors } = validateRequired(
      { CodeVoucher, TenVoucher, PhanTramGiam, SoLuong },
      ['CodeVoucher', 'TenVoucher', 'PhanTramGiam', 'SoLuong']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidPercentage(PhanTramGiam)) {
      throw ApiError.badRequest('Phan tram giam phai tu 0 den 100');
    }

    if (!isValidNumber(SoLuong, 0, 100000)) {
      throw ApiError.badRequest('So luong khong hop le');
    }

    // Check code unique
    const existing = await Voucher.findOne({ where: { CodeVoucher } });
    if (existing) {
      throw ApiError.conflict('Ma voucher da ton tai');
    }

    const voucher = await Voucher.create({
      CodeVoucher,
      TenVoucher,
      PhanTramGiam,
      SoLuong,
      DiemDoi: DiemDoi || 0,
      NgayHetHan: NgayHetHan || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    sendCreated(res, voucher, 'Tao voucher thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.updateVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TenVoucher, PhanTramGiam, SoLuong, DiemDoi, NgayHetHan } = req.body;

    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw ApiError.notFound('Voucher khong tim thay');
    }

    if (PhanTramGiam && !isValidPercentage(PhanTramGiam)) {
      throw ApiError.badRequest('Phan tram giam phai tu 0 den 100');
    }

    if (SoLuong !== undefined && !isValidNumber(SoLuong, 0, 100000)) {
      throw ApiError.badRequest('So luong khong hop le');
    }

    const updateData = {};
    if (TenVoucher) updateData.TenVoucher = TenVoucher;
    if (PhanTramGiam) updateData.PhanTramGiam = PhanTramGiam;
    if (SoLuong !== undefined) updateData.SoLuong = SoLuong;
    if (DiemDoi !== undefined) updateData.DiemDoi = DiemDoi;
    if (NgayHetHan) updateData.NgayHetHan = NgayHetHan;

    await voucher.update(updateData);

    sendSuccess(res, 200, 'Cap nhat voucher thanh cong', voucher);
  } catch (error) {
    next(error);
  }
};

exports.deleteVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw ApiError.notFound('Voucher khong tim thay');
    }

    await voucher.destroy();
    sendSuccess(res, 200, 'Xoa voucher thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.validateVoucher = async (req, res, next) => {
  try {
    const { CodeVoucher } = req.body;

    if (!CodeVoucher) {
      throw ApiError.badRequest('Code voucher la bat buoc');
    }

    const voucher = await Voucher.findOne({ where: { CodeVoucher } });
    if (!voucher) {
      throw ApiError.notFound('Voucher khong tim thay');
    }

    if (voucher.SoLuong <= 0) {
      throw ApiError.conflict('Voucher het so luong');
    }

    if (voucher.NgayHetHan < new Date()) {
      throw ApiError.conflict('Voucher da het han');
    }

    sendSuccess(res, 200, 'Voucher hop le', voucher);
  } catch (error) {
    next(error);
  }
};

exports.redeemVoucher = async (req, res, next) => {
  try {
    const { CodeVoucher } = req.body;

    if (!CodeVoucher) {
      throw ApiError.badRequest('Code voucher la bat buoc');
    }

    const voucher = await Voucher.findOne({ where: { CodeVoucher } });
    if (!voucher) {
      throw ApiError.notFound('Voucher khong tim thay');
    }

    if (voucher.SoLuong <= 0) {
      throw ApiError.conflict('Voucher het so luong');
    }

    if (voucher.NgayHetHan < new Date()) {
      throw ApiError.conflict('Voucher da het han');
    }

    voucher.SoLuong -= 1;
    await voucher.save();

    sendSuccess(res, 200, 'Dung voucher thanh cong', voucher);
  } catch (error) {
    next(error);
  }
};

exports.getActiveVouchers = async (req, res, next) => {
  try {
    const now = new Date();

    const vouchers = await Voucher.findAll({
      where: {
        SoLuong: { [require('sequelize').Op.gt]: 0 },
        NgayHetHan: { [require('sequelize').Op.gte]: now }
      }
    });

    sendSuccess(res, 200, 'Lay danh sach voucher hoat dong thanh cong', vouchers);
  } catch (error) {
    next(error);
  }
};
