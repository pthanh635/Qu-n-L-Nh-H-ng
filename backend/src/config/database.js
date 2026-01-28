const { Sequelize } = require('sequelize');
require('dotenv').config();

// Validate required environment variables
const requiredEnvs = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  console.error(`❌ Missing environment variables: ${missingEnvs.join(', ')}`);
  process.exit(1);
}

/**
 * Database Configuration
 * Environment Variables:
 * - DB_HOST: MySQL server host (default: localhost)
 * - DB_PORT: MySQL server port (default: 3306)
 * - DB_USER: MySQL username (required)
 * - DB_PASSWORD: MySQL password (required)
 * - DB_NAME: Database name (required)
 * - NODE_ENV: Environment type (development/production) for logging
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,     // tên database
  process.env.DB_USER,     // user mysql
  process.env.DB_PASSWORD, // password mysql
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',

    // SQL logging: bật trong development để debug, tắt trong production
    logging: false,

    timezone: '+07:00', // giờ Việt Nam (UTC+7)

    define: {
      freezeTableName: true, // không tự đổi tên bảng (MonAn -> MonAns)
      timestamps: false      // app tự quản lý timestamps nếu cần
    },

    pool: {
      max: 10,              // tối đa 10 connection
      min: 0,               // tối thiểu 0 connection
      acquire: 30000,       // timeout 30s khi acquire connection
      idle: 10000           // connection idle timeout 10s
    },

    // Retry strategy cho connection failures
    retry: {
      max: 3,               // retry tối đa 3 lần
      match: [             // retry cho các error cụ thể
        /SequelizeConnectionError/,
        /SequelizeTimeoutError/,
        /PROTOCOL_CONNECTION_LOST/,
        /PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR/,
        /PROTOCOL_PACKETS_OUT_OF_ORDER/,
        /ECONNREFUSED/,
        /ENOTFOUND/
      ]
    }
  }
);

/**
 * Kết nối tới database
 * @throws {Error} Nếu không thể kết nối
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công');
    return true;
  } catch (error) {
    console.error('❌ Kết nối MySQL thất bại:', error.message);
    throw error;
  }
};

/**
 * Đóng kết nối database
 */
const disconnectDB = async () => {
  try {
    await sequelize.close();
    console.log('✅ Đóng kết nối MySQL thành công');
  } catch (error) {
    console.error('❌ Lỗi khi đóng kết nối:', error.message);
  }
};

module.exports = {
  sequelize,
  connectDB,
  disconnectDB
};
