// models/TypeJeune.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("TypeJeune", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    dureeHeures: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 72 }
    },
    description: DataTypes.STRING
  });
