const { PhieuXuat, CTXuat, Kho, NguyenLieu, NhanVien } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidNumber } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllExports = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await PhieuXuat.findAndCountAll({
      include: ['nhanVien', 'chiTietXuat'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      order: [['NgayXuat', 'DESC']]
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach phieu xuat thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getExportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const exportOrder = await PhieuXuat.findByPk(id, {
      include: ['nhanVien', 'chiTietXuat']
    });

    if (!exportOrder) {
      throw ApiError.notFound('Phieu xuat khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', exportOrder);
  } catch (error) {
    next(error);
  }
};

exports.createExport = async (req, res, next) => {
  try {
    const { ID_NV } = req.body;

    if (!ID_NV) {
      throw ApiError.badRequest('ID_NV la bat buoc');
    }

    const staff = await NhanVien.findByPk(ID_NV);
    if (!staff) {
      throw ApiError.notFound('Nhan vien khong tim thay');
    }

    const exportOrder = await PhieuXuat.create({
      ID_NV,
      NgayXuat: new Date()
    });

    sendCreated(res, exportOrder, 'Tao phieu xuat thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.addItemToExport = async (req, res, next) => {
  try {
    const { exportId } = req.params;
    const { ID_NguyenLieu, SoLuong } = req.body;

    const { valid, errors } = validateRequired(
      { ID_NguyenLieu, SoLuong },
      ['ID_NguyenLieu', 'SoLuong']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidNumber(SoLuong, 1, 100000)) {
      throw ApiError.badRequest('So luong khong hop le');
    }

    const exportOrder = await PhieuXuat.findByPk(exportId);
    if (!exportOrder) {
      throw ApiError.notFound('Phieu xuat khong tim thay');
    }

    const ingredient = await NguyenLieu.findByPk(ID_NguyenLieu);
    if (!ingredient) {
      throw ApiError.notFound('Nguyen lieu khong tim thay');
    }

    // Check stock available
    const kho = await Kho.findOne({
      where: { ID_NguyenLieu }
    });

    if (!kho || kho.SLTon < SoLuong) {
      throw ApiError.badRequest('Kho khong du so luong');
    }

    const detail = await CTXuat.create({
      ID_PhieuXuat: exportId,
      ID_NguyenLieu,
      SoLuong
    });

    sendSuccess(res, 200, 'Them nguyen lieu vao phieu xuat thanh cong', detail);
  } catch (error) {
    next(error);
  }
};

exports.removeItemFromExport = async (req, res, next) => {
  try {
    const { exportId, itemId } = req.params;

    const detail = await CTXuat.findByPk(itemId);
    if (!detail || detail.ID_PhieuXuat !== parseInt(exportId)) {
      throw ApiError.notFound('Chi tiet phieu xuat khong tim thay');
    }

    await detail.destroy();

    sendSuccess(res, 200, 'Xoa nguyen lieu khoi phieu xuat thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.confirmExport = async (req, res, next) => {
  try {
    const { exportId } = req.params;

    const exportOrder = await PhieuXuat.findByPk(exportId, {
      include: ['chiTietXuat']
    });

    if (!exportOrder) {
      throw ApiError.notFound('Phieu xuat khong tim thay');
    }

    // Update inventory
    for (const item of exportOrder.chiTietXuat) {
      const kho = await Kho.findOne({
        where: { ID_NguyenLieu: item.ID_NguyenLieu }
      });

      if (!kho || kho.SLTon < item.SoLuong) {
        throw ApiError.badRequest(`Kho khong du cho ${item.ID_NguyenLieu}`);
      }

      kho.SLTon -= item.SoLuong;
      await kho.save();
    }

    sendSuccess(res, 200, 'Xac nhan phieu xuat thanh cong', exportOrder);
  } catch (error) {
    next(error);
  }
};

exports.getExportsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate, page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = {};
    if (startDate && endDate) {
      where.NgayXuat = {
        [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows } = await PhieuXuat.findAndCountAll({
      where,
      include: ['nhanVien', 'chiTietXuat'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      order: [['NgayXuat', 'DESC']]
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay phieu xuat theo khoang thoi gian thanh cong');
  } catch (error) {
    next(error);
  }
};
