const controller = require('../controllers/activity')();

module.exports = (app) => {
  app.route('/api/listActivities').get(controller.listActivities);
  app.route('/api/addActivity').post(controller.addActivity);
};
