const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom est requis" },
        len: { args: [2, 100], msg: "Le nom doit contenir au moins 2 caractères" },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: "Cet email est déjà utilisé" },
      validate: {
        notEmpty: { msg: "L'email est requis" },
        isEmail: { msg: "Format d'email invalide" },
      },
    },
    motDePasse: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le mot de passe est requis" },
        len: { args: [6, 255], msg: "Le mot de passe doit contenir au moins 6 caractères" },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [10], msg: "L'âge minimum est de 10 ans" },
      },
    },
    poidsInitial: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dateInscription: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Utilisateur",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["motDePasse"] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

// ── Hooks ────────────────────────────────────────────────────────────────────
User.beforeCreate(async (user) => {
  if (user.motDePasse) {
    const salt = await bcrypt.genSalt(10);
    user.motDePasse = await bcrypt.hash(user.motDePasse, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("motDePasse")) {
    const salt = await bcrypt.genSalt(10);
    user.motDePasse = await bcrypt.hash(user.motDePasse, salt);
  }
});

// ── Instance method ──────────────────────────────────────────────────────────
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.motDePasse);
};

module.exports = User;
