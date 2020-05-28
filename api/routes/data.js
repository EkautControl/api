const controller = require('../controllers/data')();

module.exports = (app) => {
  app.route('/api/getLastData').get(controller.getLastData);
};
