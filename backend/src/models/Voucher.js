module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define(
    'Voucher',
    {
      CodeVoucher: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: 'Code voucher duy nhất'
      },

      MoTa: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Mô tả chi tiết về voucher'
      },

      PhanTramGiam: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: 'Phần trăm giảm phải >= 0'
          },
          max: {
            args: [100],
            msg: 'Phần trăm giảm phải <= 100'
          }
        },
        comment: 'Phần trăm giảm giá (0-100)'
      },

      SoLuong: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: [0, 'Số lượng không thể âm']
        },
        comment: 'Số lượng voucher còn lại'
      },

      DiemDoi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: [0, 'Điểm đổi không thể âm']
        },
        comment: 'Số điểm tích lũy cần để đổi voucher này'
      }
    },
    {
      tableName: 'Voucher',
      timestamps: false,
      comment: 'Bảng voucher - mã giảm giá'
    }
  );

  return Voucher;
};
