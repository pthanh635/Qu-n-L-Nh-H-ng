const { HoaDon, CTHD, MonAn, Voucher, Ban, KhachHang } = require('../models');
const { sendSuccess, sendPaginated, sendCreated } = require('../utils/response');
const { validateRequired, validatePagination, isValidNumber } = require('../utils/validate');
const ApiError = require('../utils/error');

exports.getAllInvoices = async (req, res, next) => {
  try {
    const { page, limit, trangThai } = req.query;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);

    const where = {};
    if (trangThai) where.TrangThai = trangThai;

    const { count, rows } = await HoaDon.findAndCountAll({
      where,
      include: ['khachhang', 'nhanvien', 'ban', 'chitiethoadon'],
      limit: validLimit,
      offset: (validPage - 1) * validLimit,
      order: [['createdAt', 'DESC']]
    });

    sendPaginated(res, rows, count, validPage, validLimit, 'Lay danh sach hoa don thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await HoaDon.findByPk(id, {
      include: ['khachhang', 'nhanvien', 'ban', 'chitiethoadon']
    });

    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    sendSuccess(res, 200, 'Lay thong tin thanh cong', invoice);
  } catch (error) {
    next(error);
  }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const { ID_KH, ID_NV, ID_Ban } = req.body;

    const { valid, errors } = validateRequired(
      { ID_KH, ID_NV, ID_Ban },
      ['ID_KH', 'ID_NV', 'ID_Ban']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    // Validate references exist
    const [customer, staff, table] = await Promise.all([
      KhachHang.findByPk(ID_KH),
      require('../models').NhanVien.findByPk(ID_NV),
      Ban.findByPk(ID_Ban)
    ]);

    if (!customer || !staff || !table) {
      throw ApiError.notFound('Khach hang, nhan vien hoac ban khong hop le');
    }

    const invoice = await HoaDon.create({
      ID_KH,
      ID_NV,
      ID_Ban,
      TongTienMon: 0,
      VAT: 0,
      TienGiam: 0,
      TongThanhToan: 0,
      TrangThai: 'dang_mo'
    });

    sendCreated(res, invoice, 'Tao hoa don thanh cong');
  } catch (error) {
    next(error);
  }
};

exports.addItemToInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { ID_MonAn, SoLuong } = req.body;

    const { valid, errors } = validateRequired(
      { ID_MonAn, SoLuong },
      ['ID_MonAn', 'SoLuong']
    );
    if (!valid) return sendError(res, 400, 'Missing required fields', errors);

    if (!isValidNumber(SoLuong, 1, 1000)) {
      throw ApiError.badRequest('So luong phai tu 1 den 1000');
    }

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

    sendSuccess(res, 200, 'Them mon an vao hoa don thanh cong', detail);
  } catch (error) {
    next(error);
  }
};

exports.removeItemFromInvoice = async (req, res, next) => {
  try {
    const { invoiceId, itemId } = req.params;

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

    sendSuccess(res, 200, 'Xoa mon an khoi hoa don thanh cong', {});
  } catch (error) {
    next(error);
  }
};

exports.applyVoucher = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { CodeVoucher } = req.body;

    if (!CodeVoucher) {
      throw ApiError.badRequest('Ma voucher la bat buoc');
    }

    const invoice = await HoaDon.findByPk(invoiceId);
    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    const voucher = await Voucher.findOne({ where: { CodeVoucher } });
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

    sendSuccess(res, 200, 'Ap dung voucher thanh cong', invoice);
  } catch (error) {
    next(error);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { HinhThucThanhToan } = req.body;

    const invoice = await HoaDon.findByPk(invoiceId);
    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    if (invoice.TrangThai !== 'dang_mo') {
      throw ApiError.conflict('Hoa don da thanh toan hoac huy');
    }

    invoice.TrangThai = 'da_thanh_toan';
    invoice.HinhThucThanhToan = HinhThucThanhToan || 'tien_mat';
    await invoice.save();

    sendSuccess(res, 200, 'Thanh toan hoa don thanh cong', invoice);
  } catch (error) {
    next(error);
  }
};

exports.cancelInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await HoaDon.findByPk(invoiceId);
    if (!invoice) {
      throw ApiError.notFound('Hoa don khong tim thay');
    }

    if (invoice.TrangThai !== 'dang_mo') {
      throw ApiError.conflict('Chi co the huy hoa don dang mo');
    }

    invoice.TrangThai = 'da_huy';
    await invoice.save();

    sendSuccess(res, 200, 'Huy hoa don thanh cong', invoice);
  } catch (error) {
    next(error);
  }
};
