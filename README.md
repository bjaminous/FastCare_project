Parfait, voici une version **100% copiable** (sans blocs spéciaux ni formatage cassé) 👇

---

# FastCare

Une application full-stack d’accompagnement au jeûne intermittent, développée avec React et Node.js. FastCare permet aux utilisateurs de suivre leurs sessions de jeûne, définir des objectifs de santé, recevoir des rappels d’hydratation et accéder à des conseils personnalisés. Un panneau d’administration complet offre une vue d’ensemble de l’activité des utilisateurs, la gestion du contenu et des analyses de la plateforme.

---

## Table des matières

* [Vue d’ensemble](#vue-densemble)
* [Stack technique](#stack-technique)
* [Fonctionnalités](#fonctionnalités)
* [Structure du projet](#structure-du-projet)
* [Prérequis](#prérequis)
* [Installation](#installation)
* [Variables d’environnement](#variables-denvironnement)
* [Lancer l’application](#lancer-lapplication)
* [Accès administrateur](#accès-administrateur)
* [Référence API](#référence-api)
* [Schéma de base de données](#schéma-de-base-de-données)

---

## Vue d’ensemble

FastCare accompagne les utilisateurs tout au long de leur parcours de jeûne grâce à un onboarding personnalisé basé sur l’âge, le poids et l’IMC. La plateforme prend en charge plusieurs objectifs de jeûne (santé, perte de poids, spirituel, débutant), envoie des rappels d’hydratation automatisés via notifications in-app et email, et enregistre toute l’activité pour un suivi administratif.

---

## Stack technique

### Backend

| Technologie    | Version | Rôle                          |
| -------------- | ------- | ----------------------------- |
| Node.js        | >= 18   | Environnement d’exécution     |
| Express        | 5.2     | Framework HTTP                |
| Sequelize      | 6.37    | ORM                           |
| MySQL          | 8.x     | Base de données               |
| JSON Web Token | 9.0     | Authentification              |
| bcryptjs       | 3.0     | Hachage des mots de passe     |
| Nodemailer     | 8.0     | Envoi d’emails                |
| node-cron      | 4.2     | Tâches planifiées             |
| dotenv         | 17.3    | Configuration d’environnement |

### Frontend

| Technologie       | Version | Rôle                     |
| ----------------- | ------- | ------------------------ |
| React             | 19.2    | Framework UI             |
| Vite              | 6.x     | Outil de build           |
| React Router      | 7.13    | Routing côté client      |
| styled-components | 6.3     | CSS-in-JS                |
| Axios             | 1.13    | Client HTTP              |
| i18next           | 25.8    | Internationalisation     |
| Lucide React      | 0.577   | Bibliothèque d’icônes    |
| Recharts          | 3.7     | Visualisation de données |

---

## Fonctionnalités

### Côté utilisateur

* **Onboarding** — Recommandation de jeûne personnalisée basée sur l’âge, le poids et le calcul de l’IMC
* **Minuteur de jeûne** — Démarrer, mettre en pause et reprendre des sessions avec un compte à rebours en temps réel
* **Choix d’objectif** — Quatre objectifs : Santé & Vitalité, Perte de poids, Ramadan / Carême (spirituel), Découverte
* **Suivi quotidien** — Enregistrement du poids, de l’hydratation, du niveau d’énergie et de l’humeur
* **Journal** — Notes et réflexions personnelles
* **Statistiques** — Historique des jeûnes, séries, total d’heures, durée moyenne des sessions
* **Conseils santé** — Contenu filtré selon l’objectif
* **Rappels d’hydratation** — Notifications automatiques toutes les 2 heures pendant le jeûne, même hors ligne
* **Historique des notifications** — Archive complète avec filtres lu / non lu
* **Interface multilingue** — Français, anglais, arabe, espagnol, portugais, allemand, turc, indonésien, chinois

### Administration

* **Dashboard** — Statistiques globales et graphique d’activité sur 30 jours
* **Logs d’activité** — Historique des connexions, déconnexions et échecs
* **Gestion des utilisateurs** — Actif, Inactif, Banni, Supprimé
* **Notifications globales** — Envoi à tous les utilisateurs
* **CRUD conseils santé** — Gestion du contenu
* **Contrôle d’accès par rôle** — Admin / Utilisateur

---

## Structure du projet

```
FastCare_project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── i18n/
│   │   ├── pages/
│   │   │   └── admin/
│   │   └── styles/
│   └── package.json
└── README.md
```

---

## Prérequis

* Node.js >= 18
* MySQL 8.x en local
* Compte Gmail avec mot de passe d’application

---

## Installation

**1. Cloner le dépôt**

```bash
git clone <repository-url>
cd FastCare_project
```

**2. Installer le backend**

```bash
cd backend
npm install
```

**3. Installer le frontend**

```bash
cd frontend
npm install
```

**4. Créer la base de données**

```sql
CREATE DATABASE fastcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**5. Configurer les variables d’environnement**

```bash
cd backend
cp .env.example .env
```

---

## Variables d’environnement

Créer un fichier `.env` dans `backend/` :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fastcare
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password
APP_URL=http://localhost:5173
ADMIN_EMAIL=fastcare@admin.com
ADMIN_PASS=Admin2026
```

---

## Lancer l’application

| Service  | URL                                            | Commande                   |
| -------- | ---------------------------------------------- | -------------------------- |
| Frontend | [http://localhost:5173](http://localhost:5173) | cd frontend && npm run dev |
| Backend  | [http://localhost:5000](http://localhost:5000) | cd backend && npm run dev  |

---

## Accès administrateur

Compte créé automatiquement au premier lancement :

| Champ        | Valeur                                                     |
| ------------ | ---------------------------------------------------------- |
| Email        | [fastcare@admin.com](mailto:fastcare@admin.com)            |
| Mot de passe | Admin2026                                                  |
| URL          | [http://localhost:5173/login](http://localhost:5173/login) |

Après connexion, redirection vers `/admin`.

---

## Référence API

Toutes les routes protégées nécessitent un token Bearer.

### Authentification

| Méthode | Endpoint           | Description     |
| ------- | ------------------ | --------------- |
| POST    | /api/auth/register | Créer un compte |
| POST    | /api/auth/login    | Connexion       |
| POST    | /api/auth/logout   | Déconnexion     |

### Utilisateur

| Méthode | Endpoint         | Description     |
| ------- | ---------------- | --------------- |
| PUT     | /api/user/update | Modifier profil |

### Jeûne

| Méthode | Endpoint        | Description        |
| ------- | --------------- | ------------------ |
| GET     | /api/jeunes     | Liste des sessions |
| POST    | /api/jeunes     | Nouvelle session   |
| PUT     | /api/jeunes/:id | Mise à jour        |

### Notifications

| Méthode | Endpoint                         | Description            |
| ------- | -------------------------------- | ---------------------- |
| GET     | /api/notifications/unread        | Notifications non lues |
| GET     | /api/notifications/history       | Historique             |
| POST    | /api/notifications/mark-all-read | Tout marquer comme lu  |

### Admin

| Méthode | Endpoint                 | Description        |
| ------- | ------------------------ | ------------------ |
| GET     | /api/admin/users         | Liste utilisateurs |
| DELETE  | /api/admin/users/:id     | Suppression        |
| PUT     | /api/admin/users/:id/ban | Bannir             |
| GET     | /api/admin/stats         | Statistiques       |

---

## Schéma de base de données

### Tables principales

| Table          | Description          |
| -------------- | -------------------- |
| Utilisateur    | Comptes utilisateurs |
| Jeunes         | Sessions de jeûne    |
| SuiviQuotidien | Données journalières |
| Journal        | Notes                |
| Statistique    | Statistiques         |
| ConseilSante   | Conseils             |
| Notification   | Notifications        |
| ActivityLog    | Logs                 |

---

## Licence

Projet développé dans un cadre académique. Tous droits réservés.

---
