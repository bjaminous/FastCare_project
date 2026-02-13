// models/Jeune.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("Jeune", {
    dateDebut: { type: DataTypes.DATE, allowNull: false },
    dateFin: DataTypes.DATE,
    statut: {
      type: DataTypes.ENUM("EN_COURS", "TERMINE"),
      defaultValue: "EN_COURS"
    }
  });
