const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Statistique = sequelize.define(
    "Statistique",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
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
            type: DataTypes.INTEGER,
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
