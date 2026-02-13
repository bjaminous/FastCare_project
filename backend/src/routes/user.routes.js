const express = require("express");
const router = express.Router();
const { getMe, updateProfile } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Toutes les routes utilisateur sont protégées
router.use(authMiddleware);

// GET /api/user/me — Profil utilisateur connecté
router.get("/me", getMe);

// PUT /api/user/update — Modifier profil
router.put("/update", updateProfile);

module.exports = router;
