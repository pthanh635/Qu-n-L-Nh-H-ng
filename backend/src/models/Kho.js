module.exports = (sequelize, DataTypes) => {
  const Kho = sequelize.define(
    'Kho',
    {
      ID_NL: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: 'Foreign key tới NguyenLieu'
      },

      SLTon: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Số lượng tồn không thể âm'
          }
        },
        comment: 'Số lượng tồn kho'
      }
    },
    {
      tableName: 'Kho',
      timestamps: false,
      comment: 'Bảng kho - quản lý số lượng tồn kho của mỗi nguyên liệu'
    }
  );

  return Kho;
};
