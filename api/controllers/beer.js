const Beer = require('../models/beer');
const Activity = require('../models/activity');
const Production = require('../models/production');
const EActivityType = require('../enums/EActivityType');

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
      const { id } = req.params;
      if (!id) throw Error('Beer id is required');
      res.send((await Beer.findById(id)) || {});
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.addBeer = async (req, res) => {
    try {
      const beer = {
        name: req.body.name,
        averageTime: req.body.averageTime,
        brewery: req.body.brewery,
        type: req.body.type,
      };
      const activity = {
        type: EActivityType.CERVEJA,
        title: `Nova cerveja adicionada: ${beer.name}`,
        description: `Cerveja ${beer.name} da cervejaria ${beer.brewery} adicionada à lista de cervejas.`,
        creationDate: new Date(),
        reporter: req.body.reporter,
      };
      await Activity.create(activity);
      res.send(await Beer.create(beer));
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  };

  controller.getProductionsByBeerId = async (req, res) => {
    const { id } = req.params;
    const productions = await Production.find({ beerId: id }, '', {
      sort: { created_at: -1 },
    });
    res.send(productions);
  };

  return controller;
};
