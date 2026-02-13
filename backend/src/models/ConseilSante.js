// models/ConseilSante.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("ConseilSante", {
    titre: DataTypes.STRING,
    contenu: DataTypes.TEXT,
    categorie: DataTypes.STRING
  });
