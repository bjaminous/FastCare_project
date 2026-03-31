const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Statistique = sequelize.define(
    "Statistique",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        dureeTotaleJeune: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        nombreJeunes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        variationPoids: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        utilisateur_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "Statistique",
        timestamps: false,
    }
);

module.exports = Statistique;
