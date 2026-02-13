// models/Journal.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("Journal", {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false }
  });
