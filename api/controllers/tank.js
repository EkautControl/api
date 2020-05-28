const Tank = require('../models/tank');

module.exports = () => {
  const controller = {};

  controller.listActiveTanks = async (req, res) => {
    try {
      const activeTanks = await Tank.aggregate([
        { $match: { active: true } },
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
      res.status(200).send(activeTanks);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };

  controller.listInactiveTanks = async (req, res) => {
    try {
      res.send(await Tank.find({ active: false }) || []);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
