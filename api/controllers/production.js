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

  controller.getProductionByTank = async (req, res) => {
    try {
      const tank = parseInt(req.query.tank);
      const production = await Tank.aggregate([
        { $match: { tank } },
        {
          $lookup: {
            from: 'productions',
            localField: 'production',
            foreignField: '_id',
            as: 'production',
          },
        },
        { $unwind: '$production' },
        {
          $lookup: {
            from: 'beers',
            localField: 'production.beerId',
            foreignField: '_id',
            as: 'beer',
          },
        },
        { $unwind: '$beer' },
        {
          $project: {
            'beer.targetValues': 0,
            'beer.active': 0,
          },
        },
      ]);
      res.status(200).send(production);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };

  controller.updateProductionPhase = async (req, res) => {
    try {
      const productionId = req.params.id;
      const { phase } = req.body;
      res.status(200).send(await Production.findByIdAndUpdate(
        { _id: productionId }, { $set: { phase } }, { useFindAndModify: false, new: true },
      ));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
