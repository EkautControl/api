const User = require('../models/user');
const notificationAgent = require('../../services/notifications')();

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
      const userEmail = req.params.email;
      const userInfo = {
        name: req.body.name,
        email: userEmail,
        phone: req.body.phone,
        notificationType: req.body.notificationType,
        notificationEmail: req.body.notificationEmail,
        subscriptionArn: req.body.subscriptionArn,
      };

      console.log(userInfo);

      // notificationAgent.unsubscribe(userInfo.subscriptionArn);

      // const response = notificationAgent.subscribe({
      //   notificationType: userInfo.notificationType.toLowerCase(),
      //   email: userInfo.notificationEmail,
      // });
      // console.log(response);

      // const result = await User.replaceOne(
      //   { email: userEmail },
      //   {
      //     name: userInfo.name,
      //     email: userInfo.email,
      //     phone: userInfo.phone,
      //     notificationType: userInfo.notificationType,
      //   }
      // );
      res.status(200).send(userInfo);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
