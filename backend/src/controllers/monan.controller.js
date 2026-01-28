const { MonAn, DanhMuc } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidNumber, isValidPrice } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllDishes = async (req, res, next) => {
  try {
    const { page, limit, trangThai } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = {};
    if (trangThai) where.TrangThai = trangThai;

    const { count, rows } = await MonAn.findAndCountAll({
      where,
      include: ['danhMuc'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach mon an thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getDishById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dish = await MonAn.findByPk(id, {
      include: ['danhMuc']
    });

    if (!dish) {
      throw ApiError.notFound('Mon an khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', dish);
  } catch (error) {
    next(error);
  }
};

exports.createDish = async (req, res, next) => {
  try {
    const { TenMonAn, DonGia, ID_DanhMuc, MoTa } = req.body;

    const { valid, errors } = validateRequired(
      { TenMonAn, DonGia, ID_DanhMuc },
      ['TenMonAn', 'DonGia', 'ID_DanhMuc']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidPrice(DonGia)) {
      throw ApiError.badRequest('Gia tien phai lon hon 0');
    }

    // Check category exists
    const category = await DanhMuc.findByPk(ID_DanhMuc);
    if (!category) {
      throw ApiError.notFound('Danh muc khong tim thay');
    }

    const dish = await MonAn.create({
      TenMonAn,
      DonGia,
      ID_DanhMuc,
      MoTa: MoTa || '',
      TrangThai: 'available'
    });

    sendCreated(res, dish, 'Tao mon an thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TenMonAn, DonGia, MoTa, TrangThai } = req.body;

    const dish = await MonAn.findByPk(id);
    if (!dish) {
      throw ApiError.notFound('Mon an khong tim thay');
    }

    if (DonGia && !isValidPrice(DonGia)) {
      throw ApiError.badRequest('Gia tien phai lon hon 0');
    }

    const updateData = {};
    if (TenMonAn) updateData.TenMonAn = TenMonAn;
    if (DonGia) updateData.DonGia = DonGia;
    if (MoTa) updateData.MoTa = MoTa;
    if (TrangThai) updateData.TrangThai = TrangThai;

    await dish.update(updateData);

    const updated = await MonAn.findByPk(id, {
      include: ['danhMuc']
    });

    sendSuccess(res, 200, 'Cap nhat mon an thanh cong', updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dish = await MonAn.findByPk(id);
    if (!dish) {
      throw ApiError.notFound('Mon an khong tim thay');
    }

    await dish.destroy();
    sendSuccess(res, 200, 'Xoa mon an thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.getDishesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await MonAn.findAndCountAll({
      where: { ID_DanhMuc: categoryId, TrangThai: 'available' },
      include: ['danhMuc'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay mon an theo danh muc thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.searchDishes = async (req, res, next) => {
  try {
    const { keyword, page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const dishes = await MonAn.findAndCountAll({
      where: {
        [require('sequelize').Op.or]: [
          { TenMonAn: { [require('sequelize').Op.like]: `%${keyword}%` } },
          { MoTa: { [require('sequelize').Op.like]: `%${keyword}%` } }
        ]
      },
      include: ['danhMuc'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, dishes.rows, dishes.count, validPage, validLimit, 'Tim kiem mon an thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getAvailableDishes = async (req, res, next) => {
  try {
    const dishes = await MonAn.findAll({
      where: { TrangThai: 'available' },
      include: ['danhMuc']
    });

    sendSuccess(res, 200, 'Lay danh sach mon an co san thanh cong', dishes);
  } catch (error) {
    next(error);
  }
};

exports.getDishesByPriceRange = async (req, res, next) => {
  try {
    const { minPrice, maxPrice, page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = { TrangThai: 'available' };
    if (minPrice) where.DonGia = { [require('sequelize').Op.gte]: minPrice };
    if (maxPrice) {
      if (where.DonGia) {
        where.DonGia[require('sequelize').Op.lte] = maxPrice;
      } else {
        where.DonGia = { [require('sequelize').Op.lte]: maxPrice };
      }
    }

    const { count, rows } = await MonAn.findAndCountAll({
      where,
      include: ['danhMuc'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Loc mon an theo gia thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.updateDishStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TrangThai } = req.body;

    if (!TrangThai) {
      throw ApiError.badRequest('TrangThai la bat buoc');
    }

    const dish = await MonAn.findByPk(id);
    if (!dish) {
      throw ApiError.notFound('Mon an khong tim thay');
    }

    await dish.update({ TrangThai });
    sendSuccess(res, 200, 'Cap nhat trang thai thanh cong', dish);
  } catch (error) {
    next(error);
  }
};

exports.updateDishPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { DonGia } = req.body;

    if (!DonGia || DonGia <= 0) {
      throw ApiError.badRequest('DonGia phai > 0');
    }

    const dish = await MonAn.findByPk(id);
    if (!dish) {
      throw ApiError.notFound('Mon an khong tim thay');
    }

    await dish.update({ DonGia });
    sendSuccess(res, 200, 'Cap nhat gia thanh cong', dish);
  } catch (error) {
    next(error);
  }
};
