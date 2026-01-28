const { Kho, NguyenLieu } = require('../models');
const ApiError = require('../utils/error');

class KhoService {
  async getInventoryByIngredient(ingredientId) {
    const inventory = await Kho.findOne({
      where: { ID_NguyenLieu: ingredientId },
      include: ['nguyenLieu']
    });

    if (!inventory) {
      return { SLTon: 0 };
    }

    return inventory;
  }

  async updateStock(ingredientId, quantity) {
    let inventory = await Kho.findOne({
      where: { ID_NguyenLieu: ingredientId }
    });

    if (!inventory) {
      inventory = await Kho.create({
        ID_NguyenLieu: ingredientId,
        SLTon: quantity
      });
    } else {
      inventory.SLTon = quantity;
      await inventory.save();
    }

    return inventory;
  }

  async decreaseStock(ingredientId, quantity) {
    const inventory = await Kho.findOne({
      where: { ID_NguyenLieu: ingredientId }
    });

    if (!inventory || inventory.SLTon < quantity) {
      throw ApiError.badRequest('Kho khong du so luong');
    }

    inventory.SLTon -= quantity;
    await inventory.save();

    return inventory;
  }

  async increaseStock(ingredientId, quantity) {
    let inventory = await Kho.findOne({
      where: { ID_NguyenLieu: ingredientId }
    });

    if (!inventory) {
      inventory = await Kho.create({
        ID_NguyenLieu: ingredientId,
        SLTon: quantity
      });
    } else {
      inventory.SLTon += quantity;
      await inventory.save();
    }

    return inventory;
  }

  async getLowStockAlerts(threshold = 10) {
    const items = await Kho.findAll({
      where: { SLTon: { [require('sequelize').Op.lte]: threshold } },
      include: ['nguyenLieu']
    });

    return items;
  }
}

module.exports = new KhoService();
