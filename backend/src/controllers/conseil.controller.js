// controllers/conseil.controller.js
const { ConseilSante } = require("../models");

exports.create = async (req, res) => {
  const conseil = await ConseilSante.create(req.body);
  res.status(201).json(conseil);
};

exports.getByCategory = async (req, res) => {
  const conseils = await ConseilSante.findAll({
    where: { categorie: req.query.categorie }
  });
  res.json(conseils);
};
