const controller = require('../controllers/activity')();

module.exports = (app) => {
  app.route('/api/activities').get(controller.listActivities);
  app.route('/api/activity').post(controller.addActivity);
};
