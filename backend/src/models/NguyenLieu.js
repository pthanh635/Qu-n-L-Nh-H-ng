module.exports = (sequelize, DataTypes) => {
  const NguyenLieu = sequelize.define(
    'NguyenLieu',
    {
      ID_NL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      TenNL: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          name: 'tennl_unique',
          msg: 'Tên nguyên liệu này đã tồn tại'
        },
        comment: 'Tên nguyên liệu: Gạo, Cà chua, etc.'
      },

      DonGia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: 'Giá phải lớn hơn hoặc bằng 0'
          }
        },
        comment: 'Giá mua nguyên liệu'
      },

      DonViTinh: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Đơn vị tính: kg, lít, cái, bộ, etc.'
      }
    },
    {
      tableName: 'NguyenLieu',
      timestamps: false,
      comment: 'Bảng nguyên liệu - danh sách các nguyên liệu trong kho'
    }
  );

  return NguyenLieu;
};
