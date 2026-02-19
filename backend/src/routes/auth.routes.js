const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");

// POST /api/auth/register — Inscription
router.post("/register", register);

// POST /api/auth/login — Connexion
router.post("/login", login);

module.exports = router;
