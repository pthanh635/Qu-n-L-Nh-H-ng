require('dotenv').config();

const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  publicKey: process.env.STRIPE_PUBLIC_KEY,
  fee: {
    percentage: 2.9,
    fixed: 0.30
  }
};

const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  fee: {
    percentage: 2.2,
    fixed: 0.30
  }
};

const paymentConfig = {
  methods: {
    cash: { enabled: true, name: 'Tien mat' },
    card: { enabled: process.env.STRIPE_SECRET_KEY ? true : false, name: 'The tin dung' },
    paypal: { enabled: process.env.PAYPAL_CLIENT_ID ? true : false, name: 'PayPal' },
    transfer: { enabled: true, name: 'Chuyen khoan' },
    mobile: { enabled: true, name: 'Vi dien tu' }
  },
  currency: process.env.PAYMENT_CURRENCY || 'VND',
  timeout: 30000
};

module.exports = {
  stripeConfig,
  paypalConfig,
  paymentConfig
};
