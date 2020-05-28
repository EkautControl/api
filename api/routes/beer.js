const controller = require('../controllers/beer')();

module.exports = (app) => {
  app.route('/api/listBeers').get(controller.listBeers);
  app.route('/api/getBeer').get(controller.getBeer);
};
