const { HoaDon, MonAn, KhachHang, NhanVien, Kho } = require('../models');
const { sequelize } = require('../config/database');
const { sendSuccess } = require('../utils/response');
const { validateDateRange } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const Op = sequelize.Sequelize.Op;
    const [totalRevenue, totalOrders, totalCustomers, totalStaff] = await Promise.all([
      HoaDon.sum('TongThanhToan', {
        where: {
          TrangThai: 'da_thanh_toan',
          createdAt: { [Op.gte]: today }
        }
      }),
      HoaDon.count({
        where: {
          TrangThai: 'da_thanh_toan',
          createdAt: { [Op.gte]: today }
        }
      }),
      KhachHang.count(),
      NhanVien.count()
    ]);

    sendSuccess(res, 200, 'Lay dashboard thanh cong', {
      totalRevenue: totalRevenue || 0,
      totalOrders: totalOrders || 0,
      totalCustomers,
      totalStaff
    });
  } catch (error) {
    next(error);
  }
};

exports.getDailyRevenue = async (req, res, next) => {
  try {
    const { days } = req.query;
    const daysCount = Math.min(parseInt(days) || 7, 30);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);

    const revenues = await HoaDon.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('SUM', require('sequelize').col('TongThanhToan')), 'revenue'],
        [require('sequelize').fn('COUNT', require('sequelize').col('ID_HoaDon')), 'orders']
      ],
      where: {
        TrangThai: 'da_thanh_toan',
        createdAt: { [require('sequelize').Op.gte]: startDate }
      },
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'DESC']],
      raw: true
    });

    sendSuccess(res, 200, 'Lay doanh thu theo ngay thanh cong', revenues);
  } catch (error) {
    next(error);
  }
};

exports.getWeeklyRevenue = async (req, res, next) => {
  try {
    const { weeks } = req.query;
    const weeksCount = Math.min(parseInt(weeks) || 4, 52);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeksCount * 7));

    const revenues = await HoaDon.findAll({
      attributes: [
        [require('sequelize').fn('YEAR', require('sequelize').col('createdAt')), 'year'],
        [require('sequelize').fn('WEEK', require('sequelize').col('createdAt')), 'week'],
        [require('sequelize').fn('SUM', require('sequelize').col('TongThanhToan')), 'revenue']
      ],
      where: {
        TrangThai: 'da_thanh_toan',
        createdAt: { [require('sequelize').Op.gte]: startDate }
      },
      group: [
        require('sequelize').fn('YEAR', require('sequelize').col('createdAt')),
        require('sequelize').fn('WEEK', require('sequelize').col('createdAt'))
      ],
      order: [[require('sequelize').fn('YEAR', require('sequelize').col('createdAt')), 'DESC']],
      raw: true
    });

    sendSuccess(res, 200, 'Lay doanh thu theo tuan thanh cong', revenues);
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyRevenue = async (req, res, next) => {
  try {
    const { months } = req.query;
    const monthsCount = Math.min(parseInt(months) || 12, 24);

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsCount);

    const revenues = await HoaDon.findAll({
      attributes: [
        [require('sequelize').fn('YEAR', require('sequelize').col('createdAt')), 'year'],
        [require('sequelize').fn('MONTH', require('sequelize').col('createdAt')), 'month'],
        [require('sequelize').fn('SUM', require('sequelize').col('TongThanhToan')), 'revenue']
      ],
      where: {
        TrangThai: 'da_thanh_toan',
        createdAt: { [require('sequelize').Op.gte]: startDate }
      },
      group: [
        require('sequelize').fn('YEAR', require('sequelize').col('createdAt')),
        require('sequelize').fn('MONTH', require('sequelize').col('createdAt'))
      ],
      order: [[require('sequelize').fn('YEAR', require('sequelize').col('createdAt')), 'DESC']],
      raw: true
    });

    sendSuccess(res, 200, 'Lay doanh thu theo thang thanh cong', revenues);
  } catch (error) {
    next(error);
  }
};

exports.getTopDishes = async (req, res, next) => {
  try {
    const { limit, days } = req.query;
    const topLimit = Math.min(parseInt(limit) || 10, 50);
    const daysCount = Math.min(parseInt(days) || 7, 90);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);

    const topDishes = await sequelize.query(`
      SELECT m.ID_MonAn, m.TenMonAn, m.DonGia, SUM(c.SoLuong) as totalQty, SUM(c.ThanhTien) as totalRevenue
      FROM MonAn m
      JOIN CTHD c ON m.ID_MonAn = c.ID_MonAn
      JOIN HoaDon h ON c.ID_HoaDon = h.ID_HoaDon
      WHERE h.TrangThai = 'da_thanh_toan' AND h.createdAt >= ?
      GROUP BY m.ID_MonAn
      ORDER BY totalRevenue DESC
      LIMIT ?
    `, {
      replacements: [startDate, topLimit],
      type: sequelize.QueryTypes.SELECT
    });

    sendSuccess(res, 200, 'Lay mon an ban chay thanh cong', topDishes);
  } catch (error) {
    next(error);
  }
};

exports.getTopCustomers = async (req, res, next) => {
  try {
    const { limit, days } = req.query;
    const topLimit = Math.min(parseInt(limit) || 10, 50);
    const daysCount = Math.min(parseInt(days) || 30, 365);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysCount);

    const topCustomers = await sequelize.query(`
      SELECT k.ID_KH, u.Ten, u.Email, SUM(h.TongThanhToan) as totalSpent, COUNT(h.ID_HoaDon) as totalOrders
      FROM KhachHang k
      JOIN NguoiDung u ON k.ID_ND = u.ID_ND
      JOIN HoaDon h ON k.ID_KH = h.ID_KH
      WHERE h.TrangThai = 'da_thanh_toan' AND h.createdAt >= ?
      GROUP BY k.ID_KH
      ORDER BY totalSpent DESC
      LIMIT ?
    `, {
      replacements: [startDate, topLimit],
      type: sequelize.QueryTypes.SELECT
    });

    sendSuccess(res, 200, 'Lay khach hang chi tieu nhieu nhat thanh cong', topCustomers);
  } catch (error) {
    next(error);
  }
};

exports.getProfitReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const validation = validateDateRange(startDate, endDate);
    if (!validation.valid) {
      throw ApiError.badRequest(validation.error);
    }

    const report = await sequelize.query(`
      SELECT 
        SUM(h.TongThanhToan) as totalRevenue,
        SUM(h.TienGiam) as totalDiscount,
        SUM(h.VAT) as totalVAT,
        COUNT(h.ID_HoaDon) as totalOrders,
        AVG(h.TongThanhToan) as avgOrderValue
      FROM HoaDon h
      WHERE h.TrangThai = 'da_thanh_toan' AND h.createdAt BETWEEN ? AND ?
    `, {
      replacements: [new Date(startDate), new Date(endDate)],
      type: sequelize.QueryTypes.SELECT
    });

    sendSuccess(res, 200, 'Lay bao cao loi nhuan thanh cong', report[0]);
  } catch (error) {
    next(error);
  }
};

exports.getInventoryReport = async (req, res, next) => {
  try {
    const report = await Kho.findAll({
      include: [{
        association: 'nguyenLieu',
        attributes: ['TenNL', 'DonGia']
      }],
      raw: false
    });

    const formattedReport = report.map(item => ({
      ID_NL: item.ID_NL,
      SLTon: item.SLTon,
      tenNguyenLieu: item.nguyenLieu.TenNL,
      donGia: item.nguyenLieu.DonGia,
      totalValue: item.SLTon * item.nguyenLieu.DonGia
    }));

    const totalValue = formattedReport.reduce((sum, item) => {
      return sum + (item.totalValue || 0);
    }, 0);

    sendSuccess(res, 200, 'Lay bao cao kho hang thanh cong', {
      items: formattedReport,
      totalValue
    });
  } catch (error) {
    next(error);
  }
};

exports.getStaffPerformance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      TrangThai: 'da_thanh_toan'
    };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const performance = await sequelize.query(`
      SELECT n.ID_NV, u.Ten, COUNT(h.ID_HoaDon) as totalOrders, SUM(h.TongThanhToan) as totalRevenue
      FROM NhanVien n
      JOIN NguoiDung u ON n.ID_ND = u.ID_ND
      JOIN HoaDon h ON n.ID_NV = h.ID_NV
      WHERE h.TrangThai = 'da_thanh_toan'
      GROUP BY n.ID_NV
      ORDER BY totalRevenue DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    sendSuccess(res, 200, 'Lay bao cao hieu suat nhan vien thanh cong', performance);
  } catch (error) {
    next(error);
  }
};
