module.exports = (sequelize, DataTypes) => {
  const Ban = sequelize.define(
    'Ban',
    {
      ID_Ban: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      TenBan: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Tên bàn: Bàn 1, Bàn A, etc.'
      },

      SoChoNgoi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: 1,
            msg: 'Số chỗ ngồi phải lớn hơn 0'
          }
        },
        comment: 'Số lượng chỗ ngồi'
      },

      ViTri: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Vị trí bàn trong nhà hàng'
      },

      TrangThai: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'trong',
        validate: {
          isIn: {
            args: [['trong', 'dang_su_dung', 'da_dat']],
            msg: 'Trạng thái bàn không hợp lệ'
          }
        },
        comment: 'trong | dang_su_dung | da_dat'
      }
    },
    {
      tableName: 'Ban',
      timestamps: false,
      comment: 'Bảng bàn ăn - quản lý các bàn trong nhà hàng'
    }
  );

  return Ban;
};
