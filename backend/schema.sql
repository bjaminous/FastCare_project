CREATE DATABASE fastcare_db;
USE fastcare_db;

CREATE TABLE Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    age INT,
    poidsInitial FLOAT,
    dateInscription DATE NOT NULL
);
CREATE TABLE Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    age INT,
    poidsInitial FLOAT,
    dateInscription DATE NOT NULL
);
CREATE TABLE ConseilSante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    contenu TEXT NOT NULL,
    categorie VARCHAR(100)
);
CREATE TABLE ConsulterConseil (
    utilisateur_id INT,
    conseil_id INT,
    PRIMARY KEY (utilisateur_id, conseil_id),
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (conseil_id) REFERENCES ConseilSante(id)
);
CREATE TABLE TypeJeune (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    dureeHeures INT NOT NULL,
    description VARCHAR(255)
);
CREATE TABLE Jeune (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateDebut DATETIME NOT NULL,
    dateFin DATETIME,
    statut VARCHAR(50),
    utilisateur_id INT,
    type_jeune_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (type_jeune_id) REFERENCES TypeJeune(id)
);
CREATE TABLE Journal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    contenu TEXT NOT NULL,
    utilisateur_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);
CREATE TABLE SuiviQuotidien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    poids FLOAT,
    energie INT,
    humeur VARCHAR(100),
    jeune_id INT,
    FOREIGN KEY (jeune_id) REFERENCES Jeune(id)
);
CREATE TABLE Notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100),
    message VARCHAR(255),
    dateEnvoi DATETIME,
    utilisateur_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);
CREATE TABLE Statistique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dureeTotaleJeune INT,
    nombreJeunes INT,
    variationPoids FLOAT,
    utilisateur_id INT UNIQUE,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);
