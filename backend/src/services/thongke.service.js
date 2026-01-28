const { HoaDon } = require('../models');
const ApiError = require('../utils/error');

class ThongKeService {
  async getDailyRevenue(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

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

    return revenues;
  }

  async getMonthlyRevenue(months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

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

    return revenues;
  }

  async getTotalRevenue(startDate, endDate) {
    const result = await HoaDon.findAll({
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('TongThanhToan')), 'totalRevenue'],
        [require('sequelize').fn('COUNT', require('sequelize').col('ID_HoaDon')), 'totalOrders'],
        [require('sequelize').fn('AVG', require('sequelize').col('TongThanhToan')), 'avgOrderValue']
      ],
      where: {
        TrangThai: 'da_thanh_toan',
        createdAt: {
          [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      raw: true
    });

    return result[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
  }
}

module.exports = new ThongKeService();
