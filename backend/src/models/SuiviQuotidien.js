// models/SuiviQuotidien.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("SuiviQuotidien", {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    poids: DataTypes.FLOAT,
    energie: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 10 }
    },
    humeur: DataTypes.STRING
  });
