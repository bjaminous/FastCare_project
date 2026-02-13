const User = require("./User");
const Statistique = require("./Statistique");
const Notification = require("./Notification");

// ── Associations ─────────────────────────────────────────────────────────────

// 1 User → N Statistique (schema has UNIQUE on utilisateur_id, so effectively 1→1)
User.hasMany(Statistique, { foreignKey: "utilisateur_id", as: "statistiques" });
Statistique.belongsTo(User, { foreignKey: "utilisateur_id", as: "utilisateur" });

// 1 User → N Notification
User.hasMany(Notification, { foreignKey: "utilisateur_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "utilisateur_id", as: "utilisateur" });

module.exports = { User, Statistique, Notification };
