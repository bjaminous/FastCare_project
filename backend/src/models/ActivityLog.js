const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityLog = sequelize.define("ActivityLog", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  utilisateur_id: { type: DataTypes.INTEGER, allowNull: true },
  email:     { type: DataTypes.STRING(150), allowNull: true },
  type: {
    type: DataTypes.ENUM('LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_RESET'),
    allowNull: false,
  },
  ip:      { type: DataTypes.STRING(60),  allowNull: true },
  details: { type: DataTypes.STRING(255), allowNull: true },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'ActivityLog',
  timestamps: false,
});

module.exports = ActivityLog;
