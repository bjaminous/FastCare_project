// models/TypeJeune.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("TypeJeune", {
    nom: { type: DataTypes.STRING, allowNull: false },
    dureeHeures: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 72 }
    },
    description: DataTypes.STRING
  });
