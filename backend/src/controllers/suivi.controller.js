// controllers/suivi.controller.js
const { SuiviQuotidien } = require("../models");

exports.add = async (req, res) => {
  const suivi = await SuiviQuotidien.create({
    ...req.body,
    jeuneId: req.body.jeuneId
  });
  res.status(201).json(suivi);
};

exports.update = async (req, res) => {
  await SuiviQuotidien.update(req.body, {
    where: { id: req.params.id }
  });
  res.sendStatus(200);
};
exports.stats = async (req, res) => {
  const suivis = await SuiviQuotidien.findAll({
    where: { jeuneId: req.params.jeuneId }
  });

  const poidsMoyen =
    suivis.reduce((a, s) => a + (s.poids || 0), 0) / suivis.length;

  res.json({ poidsMoyen, jours: suivis.length });
};

