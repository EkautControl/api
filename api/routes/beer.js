const controller = require('../controllers/beer')();

module.exports = (app) => {
  app.route('/api/beer').post(controller.addBeer);
  app.route('/api/beers').get(controller.listBeers);
  app.route('/api/beers/:id').get(controller.getBeer);
  app.route('/api/beers/:id/productions').get(controller.getProductionsByBeerId);
};
