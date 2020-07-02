const { ObjectId } = require('mongoose').Types;
const Temperature = require('../models/temperature');
const EBeerTypes = require('../enums/EBeerTypes');
const productionController = require('./production')();
const beerController = require('./beer')();
const notificationAgent = require('../../services/notifications')();

const getIdealTemperature = (beerType, averageTime, productionStartDate) => {
  const startDate = new Date(productionStartDate);
  const todayDate = new Date();
  const diffDays = Math.ceil((todayDate - startDate) / (1000 * 3600 * 24));
  const productionCompletion = (diffDays / averageTime) * 100;

  let idealTemperature;
  if (productionCompletion > 70) {
    idealTemperature = EBeerTypes.properties[beerType].laterTemp;
  } else {
    idealTemperature = EBeerTypes.properties[beerType].initialTemp;
  }
  return idealTemperature;
};

const verifyTemperature = (idealTemperature, newTemperature) => {
  const startThreshold = idealTemperature - 0.5;
  const endThreshold = idealTemperature + 0.5;

  if (newTemperature < startThreshold || newTemperature > endThreshold) {
    return false;
  }
  return true;
};

module.exports = () => {
  const controller = {};

  controller.getLastData = async (req, res) => {
    try {
      const productionId = req.params.id;
      if (!productionId) throw Error('Production id is required');
      res.send(
        await Temperature.find(
          { productionId: ObjectId(productionId) },
          {},
          {
            sort: { creationDate: -1 },
          }
        ).limit(3)
      );
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.sensorTemperature = (msg) => {
    const temps = JSON.parse(msg);
    const tanks = Object.keys(temps);

    const tempArray = tanks.map(async (tank) => {
      const productionData = await productionController.getProductionDataByTank(tank);
      if (productionData) {
        const tankTemperature = temps[tank];
        productionData.temperatureValue = tankTemperature;
        const beerData = await beerController.getBeerById(productionData.beerId);
        const idealTemperature = getIdealTemperature(beerData.type, beerData.averageTime, productionData.startDate);
        if (!verifyTemperature(idealTemperature, tankTemperature)) {
          const alertMessage = `Temperatura fora do ideal |
            Valor medido - ideal : ${tankTemperature}°C - ${idealTemperature}°C |
            Tanque: ${tank} | Cerveja: ${beerData.name} | Lote: ${productionData.batch}`;
          notificationAgent.publish(alertMessage);

          productionController.updateProductionHasProblem(productionData._id, true);
        } else if (productionData.hasProblem) {
          productionController.updateProductionHasProblem(productionData._id, false);
        }
        return { productionId: productionData._id, value: tankTemperature };
      }
      return false;
    });

    (async () => {
      const temperatures = (await Promise.all(tempArray)).filter(
        (item) => item !== false
      );
      await Temperature.insertMany(temperatures);
    })();
  };

  return controller;
};
