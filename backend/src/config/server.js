require('dotenv').config();

/**
 * Server Configuration
 * Environment Variables:
 * - PORT: Server port (default: 5000)
 * - NODE_ENV: Environment (development/production/test)
 * - CLIENT_URL: Client origin for CORS (default: http://localhost:3000)
 */

const serverConfig = {
  // Port
  port: process.env.PORT || 5000,

  // Environment
  env: process.env.NODE_ENV || 'development',

  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Request body limits
  bodyLimit: '10mb',
  parameterLimit: 50,

  // Rate limiting (tùy chọn, nếu sử dụng express-rate-limit)
  rateLimit: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // 100 requests per windowMs
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau'
  },

  // Timeout cho requests
  requestTimeout: 30000,  // 30 seconds

  // Cache configuration (nếu sử dụng)
  cache: {
    enable: process.env.NODE_ENV === 'production',
    ttl: 5 * 60 * 1000  // 5 minutes
  }
};

module.exports = serverConfig;
