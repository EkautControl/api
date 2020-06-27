const User = require('../models/user');

module.exports = () => {
  const controller = {};

  controller.addUser = async (req, res) => {
    try {
      const user = {
        name: req.body.name,
        email: req.body.email,
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
      const userEmail = req.params.email;
      res.send(await User.findOne({ email: userEmail }));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const userInfo = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        notificationType: req.body.notificationType,
      };

      const result = await User.replaceOne({ _id: userId }, {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        notificationType: userInfo.notificationType,
      });
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
