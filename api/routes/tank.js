const controller = require('../controllers/tank')();

module.exports = (app) => {
  app.route('/api/activeTanks').get(controller.listActiveTanks);
  app.route('/api/inactiveTanks').get(controller.listInactiveTanks);
};
