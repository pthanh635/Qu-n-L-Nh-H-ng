module.exports = (sequelize, DataTypes) => {
  const CTNhap = sequelize.define(
    'CTNhap',
    {
      ID_NK: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: 'Foreign key tới PhieuNhap'
      },

      ID_NL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: 'Foreign key tới NguyenLieu'
      },

      SoLuong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: 1,
            msg: 'Số lượng phải lớn hơn 0'
          }
        },
        comment: 'Số lượng nhập'
      },

      DonGia: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
        validate: {
          min: 0
        },
        comment: 'Giá nhập tại thời điểm nhập'
      },

      ThanhTien: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: false,
        validate: {
          min: 0
        },
        comment: 'Thành tiền = SoLuong * DonGia'
      }
    },
    {
      tableName: 'CTNhap',
      timestamps: false,
      comment: 'Chi tiết phiếu nhập - danh sách nguyên liệu trong phiếu nhập'
    }
  );

  return CTNhap;
};
