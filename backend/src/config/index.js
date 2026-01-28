const databaseConfig = require('./database');
const jwtConfig = require('./jwt');
const serverConfig = require('./server');
const { emailConfig, emailTemplates } = require('./email');
const { stripeConfig, paypalConfig, paymentConfig } = require('./payment');
const { logConfig, logPatterns } = require('./logging');

module.exports = {
  database: databaseConfig,
  jwt: jwtConfig,
  server: serverConfig,
  email: emailConfig,
  emailTemplates: emailTemplates,
  stripe: stripeConfig,
  paypal: paypalConfig,
  payment: paymentConfig,
  logging: logConfig,
  logPatterns: logPatterns,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};
