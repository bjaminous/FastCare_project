// models/Notification.js
module.exports = (sequelize, DataTypes) =>
  sequelize.define("Notification", {
    type: DataTypes.STRING,
    message: DataTypes.STRING,
    dateEnvoi: DataTypes.DATE,
    lue: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
