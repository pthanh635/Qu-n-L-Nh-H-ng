require('dotenv').config();

const logConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.LOG_FORMAT || 'text',
  files: {
    enabled: process.env.NODE_ENV === 'production',
    dir: process.env.LOG_DIR || './logs',
    maxSize: '20m',
    maxFiles: 14,
    datePattern: 'YYYY-MM-DD',
    compress: true
  },
  database: {
    enabled: false,
    table: 'logs',
    level: 'error'
  },
  console: {
    enabled: process.env.NODE_ENV !== 'production',
    colorize: true
  },
  requests: {
    enabled: true,
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    excludePaths: ['/health', '/api/health']
  },
  errors: {
    enabled: true,
    includeStackTrace: process.env.NODE_ENV !== 'production',
    includeContext: true
  }
};

const logPatterns = {
  requestFormat: ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status',
  customFormat: '[:timestamp] :level - :message'
};

module.exports = {
  logConfig,
  logPatterns
};
