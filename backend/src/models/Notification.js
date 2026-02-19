// models/Notification.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("Notification", {
    type: DataTypes.STRING,
    message: DataTypes.STRING,
    dateEnvoi: DataTypes.DATE,
    lue: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        dateEnvoi: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        utilisateur_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "Notification",
        timestamps: false,
    }
);

module.exports = Notification;
