// models/Journal.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("Journal", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    contenu: { type: DataTypes.TEXT, allowNull: false }
  });
