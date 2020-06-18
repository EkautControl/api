const controller = require('../controllers/user')();

module.exports = (app) => {
  app.route('/api/user').post(controller.addUser);
  app.route('/api/user/:id').get(controller.getUser);
  app.route('/api/user/:id').put(controller.updateUser);
};
