const controller = require('../controllers/temperature')();

module.exports = (app) => {
  app.route('/api/getLastData').get(controller.getLastData);
};
