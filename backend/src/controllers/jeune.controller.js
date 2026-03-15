const { Jeune, SuiviQuotidien } = require("../models");

exports.getAll = async (req, res) => {
  const jeunes = await Jeune.findAll({
    where: { utilisateur_id: req.user.id },
    order: [["dateDebut", "DESC"]],
  });
  res.json(jeunes);
};

exports.start = async (req, res) => {
  const actif = await Jeune.findOne({
    where: { utilisateur_id: req.user.id, statut: "EN_COURS" },
  });
  if (actif) return res.status(400).json({ message: "Jeûne déjà en cours", jeune: actif });

  const jeune = await Jeune.create({
    dateDebut: new Date(),
    utilisateur_id: req.user.id,
    typeJeuneId: req.body.typeJeuneId || null,
  });

  res.status(201).json(jeune);
};

exports.stop = async (req, res) => {
  const jeune = await Jeune.findOne({
    where: { id: req.params.id, utilisateur_id: req.user.id },
  });

  if (!jeune || jeune.statut === "TERMINE") return res.sendStatus(404);

  jeune.dateFin = new Date();
  jeune.statut = "TERMINE";
  await jeune.save();

  const dureeHeures =
    (new Date(jeune.dateFin) - new Date(jeune.dateDebut)) / (1000 * 60 * 60);

  res.json({ jeune, dureeHeures: parseFloat(dureeHeures.toFixed(2)) });
};
