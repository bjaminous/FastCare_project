// controllers/notification.controller.js
const { Notification, User } = require("../models");
const { sendWaterReminderEmail } = require("../services/email.service");

const WATER_CONSEILS = [
  "L'eau à température ambiante est mieux absorbée par l'organisme que l'eau très froide.",
  "Ajoutez une pincée de sel de mer à votre eau pour maintenir l'équilibre électrolytique.",
  "Le thé vert sans sucre est autorisé pendant le jeûne et stimule la combustion des graisses.",
  "Boire de l'eau avant de ressentir la faim aide souvent à distinguer faim et soif.",
  "L'eau pétillante sans sucre peut réduire la sensation de faim et faciliter le jeûne.",
  "Le café noir sans sucre est autorisé et peut soutenir l'énergie durant le jeûne.",
  "Une bonne hydratation améliore la concentration et réduit les maux de tête liés au jeûne.",
  "Visez 250 à 300 ml d'eau à chaque rappel pour rester bien hydraté(e) tout au long du jeûne.",
  "Les tisanes non sucrées (camomille, menthe) sont idéales pour varier votre hydratation.",
  "L'eau citronnée (sans sucre) aide à alcaliniser le corps et à soutenir la détoxification.",
];

exports.waterReminder = async (req, res, next) => {
  try {
    const { hour } = req.body;
    const index = Math.floor(((hour || 2) / 2 - 1)) % WATER_CONSEILS.length;
    const conseil = WATER_CONSEILS[Math.max(0, index)];
    const message = `💧 ${hour}h de jeûne — Buvez un verre d'eau ! Conseil : ${conseil}`;

    // Notif in-app
    await Notification.create({
      utilisateur_id: req.user.id,
      type: 'HYDRATATION',
      message,
      dateEnvoi: new Date(),
      lue: false,
    });

    // Email en arrière-plan
    const user = await User.findByPk(req.user.id);
    if (user?.email) {
      sendWaterReminderEmail({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        hour,
        conseil,
      });
    }

    res.status(201).json({ success: true, conseil });
  } catch (e) { next(e); }
};

exports.create = async (req, res) => {
  const notif = await Notification.create({
    ...req.body,
    utilisateur_id: req.user.id,
    dateEnvoi: new Date()
  });
  res.status(201).json(notif);
};

exports.getHistory = async (req, res) => {
  const list = await Notification.findAll({
    where: { utilisateur_id: req.user.id }
  });
  res.json(list);
};

exports.getUnread = async (req, res) => {
  const list = await Notification.findAll({
    where: { utilisateur_id: req.user.id, lue: false },
    order: [['dateEnvoi', 'DESC']],
    limit: 20,
  });
  res.json(list);
};

exports.markAsRead = async (req, res) => {
  await Notification.update(
    { lue: true },
    { where: { id: req.params.id, utilisateur_id: req.user.id } }
  );
  res.sendStatus(200);
};

exports.markAllRead = async (req, res) => {
  await Notification.update(
    { lue: true },
    { where: { utilisateur_id: req.user.id, lue: false } }
  );
  res.sendStatus(200);
};
