module.exports = (sequelize, DataTypes) => {
  const NguoiDung = sequelize.define(
    'NguoiDung',
    {
      ID_ND: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      Ten: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          name: 'email_unique',
          msg: 'Email này đã được đăng ký'
        },
        validate: {
          isEmail: {
            msg: 'Email không hợp lệ'
          }
        }
      },

      MatKhau: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      VerifyCode: {
        type: DataTypes.STRING(10),
        allowNull: true
      },

      TrangThai: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'active',
        comment: 'active | inactive | pending_verify'
      },

      VaiTro: {
        type: DataTypes.ENUM('admin', 'nhanvien', 'khachhang'),
        allowNull: false,
        defaultValue: 'khachhang',
        comment: 'Vai trò của người dùng trong hệ thống'
      }
    },
    {
      tableName: 'NguoiDung',
      timestamps: false,
      comment: 'Bảng người dùng - base user model cho toàn hệ thống'
    }
  );

  return NguoiDung;
};
