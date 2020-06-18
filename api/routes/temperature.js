const controller = require('../controllers/temperature')();

module.exports = (app) => {
  app.route('/api/temperature/:id').get(controller.getLastData);
};
