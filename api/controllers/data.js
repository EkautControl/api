const { ObjectId } = require('mongoose').Types;
const Data = require('../models/data');

module.exports = () => {
  const controller = {};

  controller.getLastData = async (req, res) => {
    try {
      const { beerId } = req.query;
      if (!beerId) throw Error('Beer id is required');
      res.send(await Data.findOne({ beerId: ObjectId(beerId) }, {}, {
        sort: { creationDate: -1 },
      }));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
}