const { Ban } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidNumber } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllTables = async (req, res, next) => {
  try {
    const { page, limit, trangThai } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = {};
    if (trangThai) where.TrangThai = trangThai;

    const { count, rows } = await Ban.findAndCountAll({
      where,
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach ban thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getTableById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await Ban.findByPk(id);
    if (!table) {
      throw ApiError.notFound('Ban khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', table);
  } catch (error) {
    next(error);
  }
};

exports.createTable = async (req, res, next) => {
  try {
    const { TenBan, SoChoNgoi, ViTri } = req.body;

    const { valid, errors } = validateRequired(
      { TenBan, SoChoNgoi },
      ['TenBan', 'SoChoNgoi']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidNumber(SoChoNgoi, 1, 100)) {
      throw ApiError.badRequest('So cho ngoi phai tu 1 den 100');
    }

    const table = await Ban.create({
      TenBan,
      SoChoNgoi,
      ViTri: ViTri || '',
      TrangThai: 'trong'
    });

    sendCreated(res, table, 'Tao ban thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TenBan, SoChoNgoi, ViTri, TrangThai } = req.body;

    const table = await Ban.findByPk(id);
    if (!table) {
      throw ApiError.notFound('Ban khong tim thay');
    }

    if (SoChoNgoi && !isValidNumber(SoChoNgoi, 1, 100)) {
      throw ApiError.badRequest('So cho ngoi phai tu 1 den 100');
    }

    const updateData = {};
    if (TenBan) updateData.TenBan = TenBan;
    if (SoChoNgoi) updateData.SoChoNgoi = SoChoNgoi;
    if (ViTri) updateData.ViTri = ViTri;
    if (TrangThai) updateData.TrangThai = TrangThai;

    await table.update(updateData);

    sendSuccess(res, 200, 'Cap nhat ban thanh cong', table);
  } catch (error) {
    next(error);
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await Ban.findByPk(id);
    if (!table) {
      throw ApiError.notFound('Ban khong tim thay');
    }

    await table.destroy();
    sendSuccess(res, 200, 'Xoa ban thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.getAvailableTables = async (req, res, next) => {
  try {
    const tables = await Ban.findAll({
      where: { TrangThai: 'trong' }
    });

    sendSuccess(res, 200, 'Lay danh sach ban trong thanh cong', tables);
  } catch (error) {
    next(error);
  }
};

exports.getOccupiedTables = async (req, res, next) => {
  try {
    const tables = await Ban.findAll({
      where: { TrangThai: 'dang_su_dung' }
    });

    sendSuccess(res, 200, 'Lay danh sach ban dang su dung thanh cong', tables);
  } catch (error) {
    next(error);
  }
};

exports.updateTableStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TrangThai } = req.body;

    if (!TrangThai || !['trong', 'dang_su_dung', 'da_dat'].includes(TrangThai)) {
      throw ApiError.badRequest('Trang thai khong hop le');
    }

    const table = await Ban.findByPk(id);
    if (!table) {
      throw ApiError.notFound('Ban khong tim thay');
    }

    await table.update({ TrangThai });
    sendSuccess(res, 200, 'Cap nhat trang thai ban thanh cong', table);
  } catch (error) {
    next(error);
  }
};
