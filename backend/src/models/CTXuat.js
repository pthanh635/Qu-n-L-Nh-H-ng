module.exports = (sequelize, DataTypes) => {
  const CTXuat = sequelize.define(
    'CTXuat',
    {
      ID_XK: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: 'Foreign key tới PhieuXuat'
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
        comment: 'Số lượng xuất'
      }
    },
    {
      tableName: 'CTXuat',
      timestamps: false,
      comment: 'Chi tiết phiếu xuất - danh sách nguyên liệu trong phiếu xuất'
    }
  );

  return CTXuat;
};
