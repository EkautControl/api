const { ObjectId } = require('mongoose').Types;
const Temperature = require('../models/temperature');
const productionController = require('./production')();

module.exports = () => {
  const controller = {};

  controller.getLastData = async (req, res) => {
    try {
      const { beerId } = req.query;
      if (!beerId) throw Error('Beer id is required');
      res.send(await Temperature.findOne({ beerId: ObjectId(beerId) }, {}, {
        sort: { creationDate: -1 },
      }));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.sensorTemperature = (msg) => {
    const temps = JSON.parse(msg);
    const tanks = Object.keys(temps);

    const tempArray = tanks.map(async (tank) => {
      const prodId = await productionController.getProductionByTank(tank);
      return { value: temps[tank], productionId: prodId };
    });

    (async () => {
      const temperatures = (await Promise.all(tempArray))
        .filter((item) => item.productionId !== false);
      await Temperature.insertMany(temperatures);
    })();
  };

  return controller;
};
