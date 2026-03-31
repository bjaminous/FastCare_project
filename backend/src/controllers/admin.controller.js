const { User, Jeune, ConseilSante, Notification, ActivityLog } = require("../models");
const { Op } = require("sequelize");

// ── Utilisateurs ──────────────────────────────────────────────────────────────

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [['dateInscription', 'DESC']] });
    res.json({ success: true, users });
  } catch (e) { next(e); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: "Impossible de supprimer un admin" });
    await user.destroy();
    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (e) { next(e); }
};

exports.toggleBan = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: "Impossible de bannir un admin" });
    await user.update({ banni: !user.banni });
    res.json({ success: true, banni: user.banni, message: user.banni ? "Utilisateur banni" : "Utilisateur réactivé" });
  } catch (e) { next(e); }
};

// ── Statistiques globales ─────────────────────────────────────────────────────

exports.getStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);

    const [totalUsers, newUsersMonth, totalJeunes, jeunesActifs] = await Promise.all([
      User.count(),
      User.count({ where: { dateInscription: { [Op.gte]: thirtyDaysAgo } } }),
      Jeune.count(),
      Jeune.count({ where: { statut: 'EN_COURS' } }),
    ]);

    res.json({ success: true, stats: { totalUsers, newUsersMonth, totalJeunes, jeunesActifs } });
  } catch (e) { next(e); }
};

// ── Conseils Santé ────────────────────────────────────────────────────────────

exports.getConseils = async (req, res, next) => {
  try {
    const conseils = await ConseilSante.findAll({ order: [['id', 'DESC']] });
    res.json({ success: true, conseils });
  } catch (e) { next(e); }
};

exports.createConseil = async (req, res, next) => {
  try {
    const { titre, contenu, categorie } = req.body;
    if (!titre || !contenu || !categorie)
      return res.status(400).json({ success: false, message: "titre, contenu et categorie requis" });
    const conseil = await ConseilSante.create({ titre, contenu, categorie });
    res.status(201).json({ success: true, conseil });
  } catch (e) { next(e); }
};

exports.updateConseil = async (req, res, next) => {
  try {
    const conseil = await ConseilSante.findByPk(req.params.id);
    if (!conseil) return res.status(404).json({ success: false, message: "Conseil introuvable" });
    await conseil.update(req.body);
    res.json({ success: true, conseil });
  } catch (e) { next(e); }
};

exports.deleteConseil = async (req, res, next) => {
  try {
    const conseil = await ConseilSante.findByPk(req.params.id);
    if (!conseil) return res.status(404).json({ success: false, message: "Conseil introuvable" });
    await conseil.destroy();
    res.json({ success: true, message: "Conseil supprimé" });
  } catch (e) { next(e); }
};

// ── Notifications broadcast ───────────────────────────────────────────────────

exports.broadcastNotif = async (req, res, next) => {
  try {
    const { message, type = 'INFO' } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "message requis" });

    const users = await User.findAll({ attributes: ['id'] });
    const now = new Date();
    await Notification.bulkCreate(
      users.map(u => ({ utilisateur_id: u.id, type, message, dateEnvoi: now, lue: false }))
    );

    res.json({ success: true, message: `Notification envoyée à ${users.length} utilisateurs` });
  } catch (e) { next(e); }
};

// ── Logs d'activité ───────────────────────────────────────────────────────────

exports.getLogs = async (req, res, next) => {
  try {
    const { type, limit = 100 } = req.query;
    const where = type ? { type } : {};
    const logs = await ActivityLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Math.min(Number(limit), 500),
    });
    res.json({ success: true, logs });
  } catch (e) { next(e); }
};

exports.getActivityStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);

    const [totalLogins, failedLogins, logouts, recentLogs] = await Promise.all([
      ActivityLog.count({ where: { type: 'LOGIN',        createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      ActivityLog.count({ where: { type: 'LOGIN_FAILED', createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      ActivityLog.count({ where: { type: 'LOGOUT',       createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      ActivityLog.findAll({ order: [['createdAt', 'DESC']], limit: 20 }),
    ]);

    res.json({ success: true, activityStats: { totalLogins, failedLogins, logouts }, recentLogs });
  } catch (e) { next(e); }
};
