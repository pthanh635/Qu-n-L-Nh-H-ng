module.exports = (sequelize, DataTypes) => {
  const PhieuNhap = sequelize.define(
    'PhieuNhap',
    {
      ID_NK: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      ID_NV: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Foreign key tới NhanVien - nhân viên tạo phiếu nhập'
      },

      NgayNhap: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Ngày nhập hàng'
      },

      TongTien: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        },
        comment: 'Tổng tiền nhập = tổng của (SoLuong * DonGia) trong CTNhap'
      }
    },
    {
      tableName: 'PhieuNhap',
      timestamps: false,
      comment: 'Phiếu nhập hàng - lưu thông tin nhập kho'
    }
  );

  return PhieuNhap;
};
