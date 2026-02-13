const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification JWT.
 * Vérifie la présence et la validité du token dans le header Authorization.
 * Attache les données utilisateur décodées à req.user.
 */
const authMiddleware = (req, res, next) => {
    try {
        // Récupérer le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Accès refusé. Token manquant.",
            });
        }

        // Extraire le token
        const token = authHeader.split(" ")[1];

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attacher les données utilisateur à la requête
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                success: false,
                message: "Token expiré. Veuillez vous reconnecter.",
            });
        }

        return res.status(403).json({
            success: false,
            message: "Token invalide.",
        });
    }
};

module.exports = authMiddleware;
