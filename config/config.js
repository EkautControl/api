if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

module.exports = {
  port: process.env.PORT,
  mongoURL: process.env.MONGODB_URL,
};
