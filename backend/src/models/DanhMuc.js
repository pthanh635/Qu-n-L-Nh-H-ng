module.exports = (sequelize, DataTypes) => {
  const DanhMuc = sequelize.define(
    'DanhMuc',
    {
      ID_DanhMuc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      TenDanhMuc: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          name: 'tendanhmuc_unique',
          msg: 'Tên danh mục này đã tồn tại'
        },
        comment: 'Tên danh mục: Cơm, Nước, etc.'
      },

      MoTa: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Mô tả danh mục'
      }
    },
    {
      tableName: 'DanhMuc',
      timestamps: false,
      comment: 'Bảng danh mục món ăn'
    }
  );

  return DanhMuc;
};
