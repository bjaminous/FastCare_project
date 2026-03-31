require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

// Importer les modèles pour enregistrer les associations avant sync
const { User } = require("./models");

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(async () => {
    // Répare id AUTO_INCREMENT cassé par d'anciens sync alter:true
    await sequelize.query("ALTER TABLE `Utilisateur` MODIFY COLUMN `id` INT NOT NULL AUTO_INCREMENT");
    await sequelize.query("DELETE FROM `Utilisateur` WHERE `id` = 0");
    await sequelize.query("ALTER TABLE `Utilisateur` AUTO_INCREMENT = 1000");

    // Crée la table ActivityLog si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`ActivityLog\` (
        \`id\`             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`utilisateur_id\` INT NULL,
        \`email\`          VARCHAR(150) NULL,
        \`type\`           ENUM('LOGIN','LOGOUT','LOGIN_FAILED','PASSWORD_RESET') NOT NULL,
        \`ip\`             VARCHAR(60) NULL,
        \`details\`        VARCHAR(255) NULL,
        \`createdAt\`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `).catch(() => {});

    // Ajoute les colonnes manquantes si elles n'existent pas encore
    await sequelize.query("ALTER TABLE `Utilisateur` ADD COLUMN IF NOT EXISTS `taille` INT NULL").catch(() => {});
    await sequelize.query("ALTER TABLE `Utilisateur` ADD COLUMN IF NOT EXISTS `role` ENUM('user','admin') NOT NULL DEFAULT 'user'").catch(() => {});
    await sequelize.query("ALTER TABLE `Utilisateur` ADD COLUMN IF NOT EXISTS `banni` TINYINT(1) NOT NULL DEFAULT 0").catch(() => {});

    // Crée le compte admin par défaut s'il n'existe pas
    const adminEmail = process.env.ADMIN_EMAIL || 'fastcare@admin.com';
    const adminPass  = process.env.ADMIN_PASS  || 'Admin2026';
    const existing   = await User.scope('withPassword').findOne({ where: { email: adminEmail } });
    if (!existing) {
      await User.create({
        prenom: 'Admin',
        nom: 'FastCare',
        email: adminEmail,
        motDePasse: adminPass,
        role: 'admin',
      });
      console.log(`👑 Compte admin créé : ${adminEmail}`);
    }

    console.log("✅ Base de données réparée et synchronisée");
    app.listen(PORT, () =>
      console.log(`🚀 Serveur lancé sur le port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base de données :", err.message);
    process.exit(1);
  });
