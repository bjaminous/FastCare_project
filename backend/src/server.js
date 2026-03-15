require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

// Importer les modèles pour enregistrer les associations avant sync
require("./models");

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(async () => {
    // Répare id AUTO_INCREMENT cassé par d'anciens sync alter:true
    await sequelize.query("ALTER TABLE `Utilisateur` MODIFY COLUMN `id` INT NOT NULL AUTO_INCREMENT");
    await sequelize.query("DELETE FROM `Utilisateur` WHERE `id` = 0");
    await sequelize.query("ALTER TABLE `Utilisateur` AUTO_INCREMENT = 1000");
    console.log("✅ Base de données réparée et synchronisée");
    app.listen(PORT, () =>
      console.log(`🚀 Serveur lancé sur le port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base de données :", err.message);
    process.exit(1);
  });
