module.exports = (sequelize, DataTypes) => {
  const MonAn = sequelize.define(
    'MonAn',
    {
      ID_MonAn: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      TenMonAn: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Tên món ăn'
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
        comment: 'Giá bán của món ăn'
      },

      MoTa: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Mô tả chi tiết về món ăn'
      },

      ID_DanhMuc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Foreign key tới DanhMuc'
      },

      TrangThai: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'available',
        validate: {
          isIn: {
            args: [['available', 'unavailable']],
            msg: 'Trạng thái không hợp lệ'
          }
        },
        comment: 'available | unavailable'
      },

      HinhAnh: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'URL hoặc path tới ảnh món ăn'
      }
    },
    {
      tableName: 'MonAn',
      timestamps: false,
      comment: 'Bảng món ăn - danh sách các món trong menu'
    }
  );

  return MonAn;
};