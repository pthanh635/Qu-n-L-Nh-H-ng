module.exports = (sequelize, DataTypes) => {
  const CTHD = sequelize.define(
    'CTHD',
    {
      ID_HoaDon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: 'Foreign key tới HoaDon'
      },

      ID_MonAn: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: 'Foreign key tới MonAn'
      },

      SoLuong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: {
            args: 1,
            msg: 'Số lượng phải lớn hơn 0'
          }
        },
        comment: 'Số lượng món ăn'
      },

      DonGia: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
        validate: {
          min: 0
        },
        comment: 'Giá tại thời điểm bán (có thể khác giá hiện tại)'
      },

      ThanhTien: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: false,
        validate: {
          min: 0
        },
        comment: 'Thành tiền = SoLuong * DonGia'
      },

      GhiChu: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Ghi chú đặc biệt: không đường, ít muối, etc.'
      }
    },
    {
      tableName: 'CTHD',
      timestamps: false,
      comment: 'Chi tiết hóa đơn - danh sách món ăn trong hóa đơn'
    }
  );

  return CTHD;
};
