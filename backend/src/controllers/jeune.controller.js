// controllers/jeune.controller.js
const { Jeune, SuiviQuotidien } = require("../models");

exports.start = async (req, res) => {
  const actif = await Jeune.findOne({
    where: { utilisateur_id: req.user.id, statut: "EN_COURS" }
  });

  if (actif)
    return res.status(400).json({ message: "Jeûne déjà en cours" });

  const jeune = await Jeune.create({
    dateDebut: new Date(),
    utilisateur_id: req.user.id,
    typeJeuneId: req.body.typeJeuneId
  });

  // Génération automatique du suivi
  await SuiviQuotidien.create({
    date: new Date(),
    jeuneId: jeune.id
  });

  res.status(201).json(jeune);
};
exports.stop = async (req, res) => {
  const jeune = await Jeune.findByPk(req.params.id);

  if (!jeune || jeune.statut === "TERMINE")
    return res.sendStatus(404);

  jeune.dateFin = new Date();
  jeune.statut = "TERMINE";

  await jeune.save();

  const duree =
    (new Date(jeune.dateFin) - new Date(jeune.dateDebut)) /
    (1000 * 60 * 60);

  res.json({ jeune, dureeHeures: duree });
};
