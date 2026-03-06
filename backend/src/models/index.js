const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// Importer et initialiser les modèles qui exportent des fonctions
const TypeJeune = require("./TypeJeune")(sequelize, DataTypes);
const Jeune = require("./Jeune")(sequelize, DataTypes);
const SuiviQuotidien = require("./SuiviQuotidien")(sequelize, DataTypes);

// Importer les modèles déjà initialisés
const Utilisateur = require("./User");
const User = require("./User");
const Statistique = require("./Statistique");
const Notification = require("./Notification");

// ── Associations ─────────────────────────────────────────────────────────────

// TypeJeune ↔ Jeune
TypeJeune.hasMany(Jeune);
Jeune.belongsTo(TypeJeune);

// Utilisateur ↔ Jeune
Utilisateur.hasMany(Jeune);
Jeune.belongsTo(Utilisateur);

// Jeune ↔ SuiviQuotidien
Jeune.hasMany(SuiviQuotidien);
SuiviQuotidien.belongsTo(Jeune);

// 1 User → N Statistique (schema has UNIQUE on utilisateur_id, so effectively 1→1)
User.hasMany(Statistique, { foreignKey: "utilisateur_id", as: "statistiques" });
Statistique.belongsTo(User, { foreignKey: "utilisateur_id", as: "utilisateur" });

// 1 User → N Notification
User.hasMany(Notification, { foreignKey: "utilisateur_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "utilisateur_id", as: "utilisateur" });

module.exports = { 
  sequelize,
  TypeJeune, 
  Jeune, 
  Utilisateur, 
  SuiviQuotidien, 
  User, 
  Statistique, 
  Notification 
};
