const User = require('../models/user');

module.exports = () => {
  const controller = {};

  controller.addUser = async (req, res) => {
    try {
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        notificationType: req.body.notificationType,
      };
      res.send(await User.create(user));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.getUser = async (req, res) => {
    try {
      const { userId } = req.query;
      res.send(await User.findById(userId));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
