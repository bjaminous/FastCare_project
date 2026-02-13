// controllers/typeJeune.controller.js
const { TypeJeune } = require("../models");

exports.create = async (req, res) => {
  const type = await TypeJeune.create(req.body);
  res.status(201).json(type);
};

exports.getAll = async (req, res) => {
  res.json(await TypeJeune.findAll());
};

exports.update = async (req, res) => {
  await TypeJeune.update(req.body, { where: { id: req.params.id } });
  res.sendStatus(200);
};

exports.delete = async (req, res) => {
  await TypeJeune.destroy({ where: { id: req.params.id } });
  res.sendStatus(204);
};
