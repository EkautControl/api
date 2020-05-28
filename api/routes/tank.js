const controller = require('../controllers/tank')();

module.exports = (app) => {
  app.route('/api/listActiveTanks').get(controller.listActiveTanks);
  app.route('/api/listInactiveTanks').get(controller.listInactiveTanks);
};
