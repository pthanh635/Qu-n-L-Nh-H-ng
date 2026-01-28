module.exports = (sequelize, DataTypes) => {
  const HoaDon = sequelize.define(
    'HoaDon',
    {
      ID_HoaDon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      ID_KH: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Foreign key tới KhachHang (optional nếu khách vãng lai)'
      },

      ID_NV: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Foreign key tới NhanVien - nhân viên tạo hóa đơn'
      },

      ID_Ban: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Foreign key tới Ban - bàn ăn'
      },

      NgayHD: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        comment: 'Ngày tạo hóa đơn'
      },

      TrangThai: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'dang_mo',
        validate: {
          isIn: {
            args: [['dang_mo', 'da_thanh_toan', 'da_huy']],
            msg: 'Trạng thái hóa đơn không hợp lệ'
          }
        },
        comment: 'dang_mo | da_thanh_toan | da_huy'
      },

      TongTienMon: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        },
        comment: 'Tổng tiền các món ăn (không bao gồm thuế, giảm giá)'
      },

      VAT: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        },
        comment: 'Tiền VAT (thuế)'
      },

      TienGiam: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        },
        comment: 'Tiền giảm giá từ voucher'
      },

      TongThanhToan: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        },
        comment: 'Tổng thành toán = TongTienMon + VAT - TienGiam'
      },

      PhuongThucThanhToan: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Phương thức thanh toán: tien_mat, card, etc.'
      },

      CodeVoucher: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Foreign key tới Voucher'
      }
    },
    {
      tableName: 'HoaDon',
      timestamps: true,
      comment: 'Bảng hóa đơn - lưu thông tin giao dịch'
    }
  );

  return HoaDon;
};
