/**
 * Middleware centralisé de gestion des erreurs.
 * Doit être monté en dernier dans la chaîne Express.
 */
const errorHandler = (err, req, res, next) => {
    // Log serveur
    console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
    if (process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }

    // Erreur de validation Sequelize
    if (err.name === "SequelizeValidationError") {
        const messages = err.errors.map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: "Erreur de validation",
            errors: messages,
        });
    }

    // Contrainte d'unicité Sequelize
    if (err.name === "SequelizeUniqueConstraintError") {
        const messages = err.errors.map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: "Donnée en doublon",
            errors: messages,
        });
    }

    // Erreur JWT
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(403).json({
            success: false,
            message: "Token invalide ou expiré",
        });
    }

    // Erreur générique
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Erreur interne du serveur",
    });
};

module.exports = errorHandler;
