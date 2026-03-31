// models/ConseilSante.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("ConseilSante", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    titre: DataTypes.STRING,
    contenu: DataTypes.TEXT,
    categorie: DataTypes.STRING
  });
