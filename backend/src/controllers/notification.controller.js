// controllers/notification.controller.js
const { Notification } = require("../models");

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

exports.markAsRead = async (req, res) => {
  await Notification.update(
    { lue: true },
    { where: { id: req.params.id, utilisateur_id: req.user.id } }
  );
  res.sendStatus(200);
};
