const express = require("express");
const router = express.Router();
const { getUserStats } = require("../controllers/statistique.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Toutes les routes statistiques sont protégées
router.use(authMiddleware);

// GET /api/statistiques/user — Statistiques de l'utilisateur connecté
router.get("/user", getUserStats);

module.exports = router;
