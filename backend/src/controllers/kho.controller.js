const { Kho, NguyenLieu } = require('../models');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { validatePagination, isValidNumber } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllInventory = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const { count, rows } = await Kho.findAndCountAll({
      include: ['nguyenLieu'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay kho hang thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Kho.findByPk(id, {
      include: ['nguyenLieu']
    });

    if (!item) {
      throw ApiError.notFound('Kho khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', item);
  } catch (error) {
    next(error);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { SLTon } = req.body;

    if (SLTon === undefined || !isValidNumber(SLTon, 0, 1000000)) {
      throw ApiError.badRequest('So luong khong hop le');
    }

    const item = await Kho.findByPk(id);
    if (!item) {
      throw ApiError.notFound('Kho khong tim thay');
    }

    await item.update({ SLTon });

    const updated = await Kho.findByPk(id, {
      include: ['nguyenLieu']
    });

    sendSuccess(res, 200, 'Cap nhat kho thanh cong', updated);
  } catch (error) {
    next(error);
  }
};

exports.getLowStockItems = async (req, res, next) => {
  try {
    const { threshold } = req.query;
    const thresholdValue = parseInt(threshold) || 10;

    const items = await Kho.findAll({
      where: {
        SLTon: { [require('sequelize').Op.lte]: thresholdValue }
      },
      include: ['nguyenLieu']
    });

    sendSuccess(res, 200, 'Lay danh sach kho sap het thanh cong', items);
  } catch (error) {
    next(error);
  }
};

exports.getOverstockItems = async (req, res, next) => {
  try {
    const { threshold } = req.query;
    const thresholdValue = parseInt(threshold) || 100;

    const items = await Kho.findAll({
      where: {
        SLTon: { [require('sequelize').Op.gte]: thresholdValue }
      },
      include: ['nguyenLieu']
    });

    sendSuccess(res, 200, 'Lay danh sach kho thua thang cong', items);
  } catch (error) {
    next(error);
  }
};

exports.getInventorySummary = async (req, res, next) => {
  try {
    const total = await Kho.count();
    const lowStock = await Kho.count({
      where: { SLTon: { [require('sequelize').Op.lte]: 10 } }
    });
    const overStock = await Kho.count({
      where: { SLTon: { [require('sequelize').Op.gte]: 100 } }
    });

    const totalValue = await Kho.findAll({
      include: ['nguyenLieu'],
      raw: true
    });

    const inventoryValue = totalValue.reduce((sum, item) => {
      return sum + (item['nguyenLieu.DonGia'] * item.SLTon || 0);
    }, 0);

    sendSuccess(res, 200, 'Lay thong ke kho thanh cong', {
      total,
      lowStock,
      overStock,
      inventoryValue
    });
  } catch (error) {
    next(error);
  }
};
