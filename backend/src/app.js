const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const statistiqueRoutes = require("./routes/statistique.routes");

const app = express();

// ── Middlewares globaux ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Route racine ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "FastCare API running (MySQL)" });
});

// ── Montage des routes ───────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/statistiques", statistiqueRoutes);

// ── Gestion centralisée des erreurs (dernier middleware) ─────────────────────
app.use(errorHandler);

module.exports = app;
