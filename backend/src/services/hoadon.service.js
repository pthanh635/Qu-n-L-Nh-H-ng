const { HoaDon, CTHD, MonAn, Voucher, Kho } = require('../models');
const ApiError = require('../utils/error');

class HoaDonService {
  async createInvoice(data) {
    const invoice = await HoaDon.create({
      ID_KH: data.ID_KH,
      ID_NV: data.ID_NV,
      ID_Ban: data.ID_Ban,
      TongTienMon: 0,
      VAT: 0,
      TienGiam: 0,
      TongThanhToan: 0,
      TrangThai: 'dang_mo'
    });

    return invoice;
  }

  async addItem(invoiceId, itemData) {
    const { ID_MonAn, SoLuong } = itemData;

    const invoice = await HoaDon.findByPk(invoiceId);
    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    const dish = await MonAn.findByPk(ID_MonAn);
    if (!dish) {
      throw ApiError.notFound('Mon an khong tim thay');
    }

    // Check if item already in invoice
    let detail = await CTHD.findOne({
      where: { ID_HoaDon: invoiceId, ID_MonAn }
    });

    const thanhTien = dish.DonGia * SoLuong;

    if (detail) {
      detail.SoLuong += SoLuong;
      detail.ThanhTien += thanhTien;
      await detail.save();
    } else {
      detail = await CTHD.create({
        ID_HoaDon: invoiceId,
        ID_MonAn,
        SoLuong,
        DonGia: dish.DonGia,
        ThanhTien: thanhTien
      });
    }

    // Update invoice total
    invoice.TongTienMon += thanhTien;
    invoice.TongThanhToan = invoice.TongTienMon + invoice.VAT - invoice.TienGiam;
    await invoice.save();

    return detail;
  }

  async removeItem(invoiceId, itemId) {
    const detail = await CTHD.findByPk(itemId);
    if (!detail || detail.ID_HoaDon !== parseInt(invoiceId)) {
      throw ApiError.notFound('Chi tiet hoa don khong tim thay');
    }

    const invoice = await HoaDon.findByPk(invoiceId);
    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    // Update invoice total
    invoice.TongTienMon -= detail.ThanhTien;
    invoice.TongThanhToan = invoice.TongTienMon + invoice.VAT - invoice.TienGiam;
    await invoice.save();

    await detail.destroy();
    return { success: true };
  }

  async applyVoucher(invoiceId, codeVoucher) {
    const invoice = await HoaDon.findByPk(invoiceId);
    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    const voucher = await Voucher.findOne({ where: { CodeVoucher: codeVoucher } });
    if (!voucher) {
      throw ApiError.notFound('Voucher khong tim thay');
    }

    if (voucher.SoLuong <= 0) {
      throw ApiError.conflict('Voucher het so luong');
    }

    const discount = (invoice.TongTienMon * voucher.PhanTramGiam) / 100;
    invoice.TienGiam = discount;
    invoice.TongThanhToan = invoice.TongTienMon + invoice.VAT - invoice.TienGiam;
    await invoice.save();

    return invoice;
  }

  async checkout(invoiceId, paymentMethod) {
    const invoice = await HoaDon.findByPk(invoiceId);
    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    if (invoice.TrangThai !== 'dang_mo') {
      throw ApiError.conflict('Hoa don da thanh toan hoac huy');
    }

    invoice.TrangThai = 'da_thanh_toan';
    invoice.HinhThucThanhToan = paymentMethod || 'tien_mat';
    await invoice.save();

    return invoice;
  }
}

module.exports = new HoaDonService();
