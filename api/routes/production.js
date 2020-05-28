const controller = require('../controllers/production')();

module.exports = (app) => {
  app.route('/api/addProduction').post(controller.addProduction);
};
