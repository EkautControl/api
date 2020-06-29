const mongose = require('mongoose');
const Production = require('../models/production');
const Tank = require('../models/tank');
const Beer = require('../models/beer');
const Activity = require('../models/activity');
const EPhases = require('../enums/EPhases');
const EActivityType = require('../enums/EActivityType');

const updateBeerStatus = async (id) => {
  const beer = await Production.find({
    beerId: id,
    endDate: { $exists: false },
  });

  if (beer.length === 1) {
    await Beer.findByIdAndUpdate(
      { _id: id },
      { $set: { active: false } },
      { useFindAndModify: false, new: true }
    );
  }
};

const updateTankStatus = async (tank) => {
  await Tank.findOneAndUpdate(
    { tank },
    { $unset: { production: '' } },
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
      const { reporter } = req.body;
      const production = {
        tank: req.body.tank,
        beerId: req.body.beerId,
        batch: req.body.batch,
        phase: req.body.phase,
        ferment: req.body.ferment,
        leaven: req.body.leaven,
        generation: req.body.generation,
        startDate: req.body.date,
      };
      const productionObj = await Production.create(production);
      const tank = await Tank.findOne({ tank: production.tank });
      const beer = await Beer.findById(production.beerId);
      const activity = {
        type: EActivityType.TANQUE,
        title: `Nova produção adicionada ao Tanque ${tank.tank}`,
        description: `Lote ${productionObj.batch} - Cerveja: ${beer.name}`,
        creationDate: productionObj.startDate,
        reporter,
      };
      await tank.updateOne({
        $set: { production: mongose.Types.ObjectId(productionObj._id) },
      });
      await beer.updateOne({ $set: { active: true } });
      await Activity.create(activity);
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
    const production = await Production.find({ tank: tankNumber }, '_id', {
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
      const { phase, reporter } = req.body;
      const production = await Production.findByIdAndUpdate(
        { _id: productionId },
        { $set: { phase } },
        { useFindAndModify: false, new: true }
      );
      const beer = await Beer.findById(production.beerId);
      const activity = {
        type: EActivityType.TANQUE,
        title: `Mudança de fase de produção do Tanque ${production.tank}`,
        description: `Fase atual: ${EPhases.properties[production.phase].label} | Lote ${
          production.batch
        } - Cerveja: ${beer.name}`,
        creationDate: production.startDate,
        reporter,
      };
      if (phase === EPhases.FINALIZADO) {
        updateBeerStatus(production.beerId);
        updateTankStatus(production.tank);
        setProductionEndDate(productionId);
      }
      await Activity.create(activity);
      res.status(200).send(production);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.addProductionData = async (req, res) => {
    try {
      const productionId = req.params.id;
      const data = {
        data: req.body.data,
        analysis: req.body.analysis,
        phase: req.body.phase,
        reporter: req.body.reporter,
        creationDate: Date(req.body.date),
      };
      res.send(
        await Production.findByIdAndUpdate(
          productionId,
          {
            $push: { data },
          },
          { useFindAndModify: false, new: true }
        )
      );
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };

  controller.deleteProduction = async (req, res) => {
    try {
      const productionId = req.params.id;
      const production = await Production.findByIdAndDelete(productionId);
      updateBeerStatus(production.beerId);
      updateTankStatus(production.tank);
      res.send('Deleted.');
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };

  return controller;
};
