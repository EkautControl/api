const Beer = require('../models/beer');

module.exports = () => {
  const controller = {};

  controller.listBeers = async (req, res) => {
    try {
      res.status(200).send(await Beer.find());
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };

  controller.getBeer = async (req, res) => {
    try {
      const { beerId } = req.query;
      if (!beerId) throw Error('Beer id is required');
      res.send(await Beer.findById(beerId) || {});
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
