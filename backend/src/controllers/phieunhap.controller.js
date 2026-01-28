const { PhieuNhap, CTNhap, Kho, NguyenLieu, NhanVien } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidNumber } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllImports = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await PhieuNhap.findAndCountAll({
      include: ['nhanVien', 'chiTietNhap'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      order: [['NgayNhap', 'DESC']]
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach phieu nhap thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getImportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const importOrder = await PhieuNhap.findByPk(id, {
      include: ['nhanVien', 'chiTietNhap']
    });

    if (!importOrder) {
      throw ApiError.notFound('Phieu nhap khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', importOrder);
  } catch (error) {
    next(error);
  }
};

exports.createImport = async (req, res, next) => {
  try {
    const { ID_NV } = req.body;

    if (!ID_NV) {
      throw ApiError.badRequest('ID_NV la bat buoc');
    }

    const staff = await NhanVien.findByPk(ID_NV);
    if (!staff) {
      throw ApiError.notFound('Nhan vien khong tim thay');
    }

    const importOrder = await PhieuNhap.create({
      ID_NV,
      NgayNhap: new Date(),
      TongTien: 0
    });

    sendCreated(res, importOrder, 'Tao phieu nhap thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.addItemToImport = async (req, res, next) => {
  try {
    const { importId } = req.params;
    const { ID_NguyenLieu, SoLuong, DonGia } = req.body;

    const { valid, errors } = validateRequired(
      { ID_NguyenLieu, SoLuong, DonGia },
      ['ID_NguyenLieu', 'SoLuong', 'DonGia']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidNumber(SoLuong, 1, 100000) || !isValidNumber(DonGia, 0, 1000000)) {
      throw ApiError.badRequest('So luong hoac gia khong hop le');
    }

    const importOrder = await PhieuNhap.findByPk(importId);
    if (!importOrder) {
      throw ApiError.notFound('Phieu nhap khong tim thay');
    }

    const ingredient = await NguyenLieu.findByPk(ID_NguyenLieu);
    if (!ingredient) {
      throw ApiError.notFound('Nguyen lieu khong tim thay');
    }

    const thanhTien = SoLuong * DonGia;

    const detail = await CTNhap.create({
      ID_PhieuNhap: importId,
      ID_NguyenLieu,
      SoLuong,
      DonGia,
      ThanhTien: thanhTien
    });

    importOrder.TongTien += thanhTien;
    await importOrder.save();

    sendSuccess(res, 200, 'Them nguyen lieu vao phieu nhap thanh cong', detail);
  } catch (error) {
    next(error);
  }
};

exports.removeItemFromImport = async (req, res, next) => {
  try {
    const { importId, itemId } = req.params;

    const detail = await CTNhap.findByPk(itemId);
    if (!detail || detail.ID_PhieuNhap !== parseInt(importId)) {
      throw ApiError.notFound('Chi tiet phieu nhap khong tim thay');
    }

    const importOrder = await PhieuNhap.findByPk(importId);
    if (!importOrder) {
      throw ApiError.notFound('Phieu nhap khong tim thay');
    }

    importOrder.TongTien -= detail.ThanhTien;
    await importOrder.save();

    await detail.destroy();

    sendSuccess(res, 200, 'Xoa nguyen lieu khoi phieu nhap thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.confirmImport = async (req, res, next) => {
  try {
    const { importId } = req.params;

    const importOrder = await PhieuNhap.findByPk(importId, {
      include: ['chiTietNhap']
    });

    if (!importOrder) {
      throw ApiError.notFound('Phieu nhap khong tim thay');
    }

    // Update inventory
    for (const item of importOrder.chiTietNhap) {
      let kho = await Kho.findOne({
        where: { ID_NguyenLieu: item.ID_NguyenLieu }
      });

      if (!kho) {
        kho = await Kho.create({
          ID_NguyenLieu: item.ID_NguyenLieu,
          SLTon: item.SoLuong
        });
      } else {
        kho.SLTon += item.SoLuong;
        await kho.save();
      }
    }

    sendSuccess(res, 200, 'Xac nhan phieu nhap thanh cong', importOrder);
  } catch (error) {
    next(error);
  }
};

exports.getImportsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate, page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = {};
    if (startDate && endDate) {
      where.NgayNhap = {
        [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows } = await PhieuNhap.findAndCountAll({
      where,
      include: ['nhanVien', 'chiTietNhap'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      order: [['NgayNhap', 'DESC']]
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay phieu nhap theo khoang thoi gian thanh cong');
  } catch (error) {
    next(error);
  }
};
