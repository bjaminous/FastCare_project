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
app.use("/api/jeunes", require("./routes/jeune.routes"));
app.use("/api/suivis", require("./routes/suivi.routes"));
app.use("/api/type-jeune", require("./routes/typeJeune.routes"));
app.use("/api/journals", require("./routes/journal.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/conseils", require("./routes/conseil.routes"));

// ── Gestion centralisée des erreurs (dernier middleware) ─────────────────────
app.use(errorHandler);

module.exports = app;
