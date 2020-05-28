const Production = require('../models/production');

module.exports = () => {
  const controller = {};

  controller.addProduction = async (req, res) => {
    try {
      const production = {
        tank: req.body.tank,
        beerId: req.body.beerId,
        batch: req.body.batch,
        phase: req.body.phase,
      };
      res.send(await Production.create(production));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
