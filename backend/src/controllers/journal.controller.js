// controllers/journal.controller.js
const { Journal } = require("../models");

exports.create = async (req, res) => {
  const journal = await Journal.create({
    ...req.body,
    utilisateur_id: req.user.id
  });
  res.status(201).json(journal);
};

exports.getAll = async (req, res) => {
  const journals = await Journal.findAll({
    where: { utilisateur_id: req.user.id }
  });
  res.json(journals);
};

exports.update = async (req, res) => {
  const journal = await Journal.findOne({
    where: { id: req.params.id, utilisateur_id: req.user.id }
  });
  if (!journal) return res.sendStatus(403);

  await journal.update(req.body);
  res.json(journal);
};

exports.delete = async (req, res) => {
  await Journal.destroy({
    where: { id: req.params.id, utilisateur_id: req.user.id }
  });
  res.sendStatus(204);
};
