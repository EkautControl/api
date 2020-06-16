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
    console.log(temps);
    const tanks = Object.keys(temps);

    tanks.forEach(async (tank) => {
      const prodId = await productionController.getProductionByTank(tank);
      if (prodId) {
        console.log(temps[tank]);
        console.log(prodId);
        await Temperature.create({
          value: temps[tank],
          productionId: prodId,
        });
      }
    });
  };

  return controller;
};
