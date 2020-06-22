const mongose = require("mongoose");
const Production = require("../models/production");
const Tank = require("../models/tank");
const Beer = require("../models/beer");
const EPhases = require("../enums/EPhases");

const updateBeerStatus = async (id) => {
  await Beer.findByIdAndUpdate(
    { _id: id },
    { $set: { active: false } },
    { useFindAndModify: false, new: true }
  );
};

const updateTankStatus = async (tank) => {
  await Tank.findOneAndUpdate(
    { tank },
    { $unset: { production: "" } },
    { useFindAndModify: false, new: true }
  );
};

const setProductionEndDate = async (id) => {
  await Production.findByIdAndUpdate(
    { _id: id },
    { $set: { endDate: new Date() } },
    { useFindAndModify: false, new: true }
  );
};

module.exports = () => {
  const controller = {};

  controller.addProduction = async (req, res) => {
    try {
      const production = {
        tank: req.body.tank,
        beerId: req.body.beerId,
        batch: req.body.batch,
        phase: req.body.phase,
        date: req.body.date || null,
      };
      const productionObj = await Production.create(production);
      const tank = await Tank.findOne({ tank: production.tank });
      const beer = await Beer.findById(production.beerId);
      await tank.updateOne({
        $set: { production: mongose.Types.ObjectId(productionObj._id) },
      });
      await beer.updateOne({ $set: { active: true } });
      res.send({
        _id: tank._id,
        tank: tank.tank,
        production: productionObj,
        beer,
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.getProductionIdByTank = async (tankNumber) => {
    const production = await Production.find({ tank: tankNumber }, "_id", {
      sort: { created_at: -1 },
    });
    if (production.length > 0) {
      const idObj = production[0];
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
            from: "productions",
            localField: "production",
            foreignField: "_id",
            as: "production",
          },
        },
        { $unwind: "$production" },
        {
          $lookup: {
            from: "beers",
            localField: "production.beerId",
            foreignField: "_id",
            as: "beer",
          },
        },
        { $unwind: "$beer" },
        {
          $project: {
            "beer.targetValues": 0,
            "beer.active": 0,
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
      const production = await Production.findByIdAndUpdate(
        { _id: productionId },
        { $set: { phase } },
        { useFindAndModify: false, new: true }
      );
      if (phase === EPhases.FINALIZADO) {
        updateBeerStatus(production.beerId);
        updateTankStatus(production.tank);
        setProductionEndDate(productionId);
      }
      res.status(200).send(production);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  return controller;
};
