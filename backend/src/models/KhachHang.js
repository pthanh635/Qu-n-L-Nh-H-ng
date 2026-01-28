module.exports = (sequelize, DataTypes) => {
  const KhachHang = sequelize.define(
    'KhachHang',
    {
      ID_KH: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      ID_ND: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          name: 'id_nd_unique',
          msg: 'Tài khoản này đã được liên kết với một khách hàng'
        },
        comment: 'Foreign key tới NguoiDung'
      },

      NgayThamGia: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        comment: 'Ngày khách hàng tham gia hệ thống'
      },

      ChiTieu: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        },
        comment: 'Tổng chi tiêu của khách hàng'
      },

      DiemTichLuy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        },
        comment: 'Điểm tích lũy để đổi voucher'
      }
    },
    {
      tableName: 'KhachHang',
      timestamps: false,
      comment: 'Bảng khách hàng - mở rộng thông tin từ NguoiDung'
    }
  );

  return KhachHang;
};
