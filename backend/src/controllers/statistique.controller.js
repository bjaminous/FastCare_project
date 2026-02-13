const { Statistique } = require("../models");

/**
 * GET /api/statistiques/user
 * Retourne les statistiques de l'utilisateur connecté.
 * L'utilisateur ne peut accéder qu'à ses propres statistiques.
 */
const getUserStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Récupérer les statistiques de l'utilisateur
        const statistiques = await Statistique.findAll({
            where: { utilisateur_id: userId },
        });

        if (!statistiques || statistiques.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucune statistique trouvée pour cet utilisateur",
            });
        }

        // Calculs agrégés
        const totalStatistiques = statistiques.length;

        const totalDuree = statistiques.reduce((sum, s) => sum + (s.dureeTotaleJeune || 0), 0);
        const totalJeunes = statistiques.reduce((sum, s) => sum + (s.nombreJeunes || 0), 0);
        const totalVariation = statistiques.reduce((sum, s) => sum + (s.variationPoids || 0), 0);

        const moyenne = {
            dureeMoyenne: totalStatistiques > 0 ? Math.round(totalDuree / totalStatistiques) : 0,
            jeunesMoyen: totalStatistiques > 0 ? Math.round(totalJeunes / totalStatistiques) : 0,
            variationMoyenne: totalStatistiques > 0
                ? parseFloat((totalVariation / totalStatistiques).toFixed(2))
                : 0,
        };

        // Calcul de progression (variation de poids globale)
        const progression = {
            dureeTotale: totalDuree,
            nombreTotalJeunes: totalJeunes,
            variationPoidsGlobale: parseFloat(totalVariation.toFixed(2)),
        };

        return res.status(200).json({
            success: true,
            totalStatistiques,
            moyenne,
            progression,
            historique: statistiques,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserStats };
