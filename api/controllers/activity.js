const Activity = require('../models/activity');

module.exports = () => {
  const controller = {};

  controller.listActivities = async (req, res) => {
    try {
      res.status(200).send(await Activity.find({}, {}, { sort: { creationDate: -1 } }));
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };

  controller.addActivity = async (req, res) => {
    try {
      const activity = {
        type: req.body.type,
        title: req.body.title,
        description: req.body.description,
        reporter: req.body.reporter,
        creationDate: Date(req.body.date),
      };
      res.send(await Activity.create(activity));
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };

  return controller;
};
