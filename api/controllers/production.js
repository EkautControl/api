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

  controller.getProductionByTank = async (tankNumber) => {
    const production = await Production.find({ tank: tankNumber }, '_id', { sort: { created_at: -1 } });
    if (production.length > 0) {
      const idObj = production[0];
      // eslint-disable-next-line no-underscore-dangle
      const prodId = idObj._id;
      return prodId;
    }
    return false;
  };

  return controller;
};
