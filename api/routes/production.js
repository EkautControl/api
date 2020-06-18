const controller = require('../controllers/production')();

module.exports = (app) => {
  app.route('/api/production').post(controller.addProduction);
  app.route('/api/production').get(controller.getProductionByTank);
  app.route('/api/production/phase/:id').put(controller.updateProductionPhase);
};
