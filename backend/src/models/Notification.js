module.exports = (sequelize, DataTypes) =>
  sequelize.define("Notification", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type:      { type: DataTypes.STRING(100), allowNull: true },
    message:   { type: DataTypes.STRING(255), allowNull: true },
    dateEnvoi: { type: DataTypes.DATE,        allowNull: true },
    lue:       { type: DataTypes.BOOLEAN,     defaultValue: false },
  }, { timestamps: false });
