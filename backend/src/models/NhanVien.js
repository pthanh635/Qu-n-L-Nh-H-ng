module.exports = (sequelize, DataTypes) => {
  const NhanVien = sequelize.define(
    'NhanVien',
    {
      ID_NV: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      ID_ND: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          name: 'id_nd_unique',
          msg: 'Tài khoản này đã được liên kết với một nhân viên'
        },
        comment: 'Foreign key tới NguoiDung'
      },

      NgayVaoLam: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Ngày vào làm của nhân viên'
      },

      SDT: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: {
            args: [10, 20],
            msg: 'Số điện thoại phải từ 10 đến 20 ký tự'
          }
        },
        comment: 'Số điện thoại liên hệ'
      },

      ChucVu: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Chức vụ: phục vụ, bếp, quản lý, etc.'
      },

      TinhTrang: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'dang_lam',
        comment: 'dang_lam | nghi | da_nghỉ'
      }
    },
    {
      tableName: 'NhanVien',
      timestamps: false,
      comment: 'Bảng nhân viên - mở rộng thông tin từ NguoiDung'
    }
  );

  return NhanVien;
};
