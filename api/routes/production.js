const controller = require('../controllers/production')();

module.exports = (app) => {
  app.route('/api/production').post(controller.addProduction);
  app.route('/api/production').get(controller.getProductionByTank);
};
