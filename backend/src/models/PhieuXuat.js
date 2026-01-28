module.exports = (sequelize, DataTypes) => {
  const PhieuXuat = sequelize.define(
    'PhieuXuat',
    {
      ID_XK: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      ID_NV: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Foreign key tới NhanVien - nhân viên tạo phiếu xuất'
      },

      NgayXuat: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Ngày xuất hàng'
      }
    },
    {
      tableName: 'PhieuXuat',
      timestamps: false,
      comment: 'Phiếu xuất hàng - lưu thông tin xuất kho'
    }
  );

  return PhieuXuat;
};
