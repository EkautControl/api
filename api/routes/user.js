const controller = require('../controllers/user')();

module.exports = (app) => {
  app.route('/api/user').post(controller.addUser);
  app.route('/api/user/:email').get(controller.getUser);
  app.route('/api/user/:email').put(controller.updateUser);
};
