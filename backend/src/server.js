require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./config/database');

// load associations (RẤT QUAN TRỌNG)
require('./associations');

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Test DB connection
    await sequelize.authenticate();

    // Đồng bộ models với database
    await sequelize.sync({ alter: true });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
}

startServer();