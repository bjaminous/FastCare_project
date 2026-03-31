-- FastCare Database Schema - UUID Version
-- Removed AUTO_INCREMENT, all IDs are VARCHAR(36)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Full Reset: Drop existing tables
-- --------------------------------------------------------
DROP TABLE IF EXISTS `consulterconseil`;
DROP TABLE IF EXISTS `ConseilSantes`;
DROP TABLE IF EXISTS `ActivityLog`;
DROP TABLE IF EXISTS `Statistique`;
DROP TABLE IF EXISTS `Notifications`;
DROP TABLE IF EXISTS `Journals`;
DROP TABLE IF EXISTS `SuiviQuotidiens`;
DROP TABLE IF EXISTS `Jeunes`;
DROP TABLE IF EXISTS `TypeJeunes`;
DROP TABLE IF EXISTS `Utilisateur`;

-- --------------------------------------------------------
-- Table: Utilisateur
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Utilisateur` (
  `id` varchar(36) NOT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `poidsInitial` float DEFAULT NULL,
  `taille` int(11) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `banni` tinyint(1) NOT NULL DEFAULT 0,
  `dateInscription` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: TypeJeunes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `TypeJeunes` (
  `id` varchar(36) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `dureeHeures` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: Jeunes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Jeunes` (
  `id` varchar(36) NOT NULL,
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime DEFAULT NULL,
  `statut` enum('EN_COURS','TERMINE') DEFAULT 'EN_COURS',
  `utilisateur_id` varchar(36) DEFAULT NULL,
  `TypeJeuneId` varchar(36) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `TypeJeuneId` (`TypeJeuneId`),
  CONSTRAINT `jeunes_ibfk_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `jeunes_ibfk_type` FOREIGN KEY (`TypeJeuneId`) REFERENCES `TypeJeunes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: SuiviQuotidiens
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `SuiviQuotidiens` (
  `id` varchar(36) NOT NULL,
  `date` date NOT NULL,
  `poids` float DEFAULT NULL,
  `energie` int(11) DEFAULT NULL,
  `humeur` varchar(255) DEFAULT NULL,
  `utilisateur_id` varchar(36) DEFAULT NULL,
  `JeuneId` varchar(36) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `JeuneId` (`JeuneId`),
  CONSTRAINT `suiviquotidiens_ibfk_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suiviquotidiens_ibfk_jeune` FOREIGN KEY (`JeuneId`) REFERENCES `Jeunes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: Journals
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Journals` (
  `id` varchar(36) NOT NULL,
  `date` date NOT NULL,
  `contenu` text NOT NULL,
  `utilisateur_id` varchar(36) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `journals_ibfk_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: Notifications
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Notifications` (
  `id` varchar(36) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `dateEnvoi` datetime DEFAULT NULL,
  `lue` tinyint(1) DEFAULT 0,
  `utilisateur_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `notifications_ibfk_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: Statistique
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Statistique` (
  `id` varchar(36) NOT NULL,
  `dureeTotaleJeune` int(11) DEFAULT NULL,
  `nombreJeunes` int(11) DEFAULT NULL,
  `variationPoids` float DEFAULT NULL,
  `utilisateur_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `statistique_ibfk_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: ConseilSantes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ConseilSantes` (
  `id` varchar(36) NOT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `contenu` text DEFAULT NULL,
  `categorie` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: consulterconseil
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `consulterconseil` (
  `utilisateur_id` varchar(36) NOT NULL,
  `conseil_id` varchar(36) NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`conseil_id`),
  KEY `conseil_id` (`conseil_id`),
  CONSTRAINT `consulterconseil_ibfk_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `consulterconseil_ibfk_conseil` FOREIGN KEY (`conseil_id`) REFERENCES `ConseilSantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: ActivityLog
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ActivityLog` (
  `id` varchar(36) NOT NULL,
  `utilisateur_id` varchar(36) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `type` enum('LOGIN','LOGOUT','LOGIN_FAILED','PASSWORD_RESET') NOT NULL,
  `ip` varchar(60) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `activitylog_ibfk_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `Utilisateur` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
