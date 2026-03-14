const { SuiviQuotidien } = require("../models");

exports.add = async (req, res) => {
  const suivi = await SuiviQuotidien.create({
    ...req.body,
    utilisateur_id: req.user.id,
    jeuneId: req.body.jeuneId || null,
  });
  res.status(201).json(suivi);
};

exports.getAll = async (req, res) => {
  const suivis = await SuiviQuotidien.findAll({
    where: { utilisateur_id: req.user.id },
    order: [["date", "DESC"]],
  });
  res.json(suivis);
};

exports.update = async (req, res) => {
  const suivi = await SuiviQuotidien.findOne({
    where: { id: req.params.id, utilisateur_id: req.user.id },
  });
  if (!suivi) return res.sendStatus(404);
  await suivi.update(req.body);
  res.json(suivi);
};

exports.stats = async (req, res) => {
  const suivis = await SuiviQuotidien.findAll({
    where: { utilisateur_id: req.user.id },
    order: [["date", "ASC"]],
  });
  const avecPoids = suivis.filter((s) => s.poids);
  const poidsMoyen =
    avecPoids.length > 0
      ? avecPoids.reduce((a, s) => a + s.poids, 0) / avecPoids.length
      : null;
  res.json({ poidsMoyen, jours: suivis.length, suivis });
};
