require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

// Importer les modèles pour enregistrer les associations avant sync
require("./models");

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données connectée et synchronisée");
    app.listen(PORT, () =>
      console.log(`🚀 Serveur lancé sur le port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base de données :", err.message);
    process.exit(1);
  });
