// models/index.js (extrait)

TypeJeune.hasMany(Jeune);
Jeune.belongsTo(TypeJeune);

Utilisateur.hasMany(Jeune);
Jeune.belongsTo(Utilisateur);

Jeune.hasMany(SuiviQuotidien);
SuiviQuotidien.belongsTo(Jeune);
