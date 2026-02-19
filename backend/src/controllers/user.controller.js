const { User } = require("../models");
const { validateUpdate } = require("../validators/user.validator");

/**
 * GET /api/user/me
 * Retourne le profil de l'utilisateur connecté (sans motDePasse).
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/user/update
 * Met à jour le profil de l'utilisateur connecté.
 * Champs modifiables : nom, age, poidsInitial.
 */
const updateProfile = async (req, res, next) => {
    try {
        // 1. Validation
        const { valid, errors } = validateUpdate(req.body);
        if (!valid) {
            return res.status(400).json({ success: false, message: "Données invalides", errors });
        }

        // 2. Récupérer l'utilisateur
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé",
            });
        }

        // 3. Mettre à jour uniquement les champs autorisés
        const { nom, age, poidsInitial } = req.body;
        const updateData = {};
        if (nom !== undefined) updateData.nom = nom;
        if (age !== undefined) updateData.age = age;
        if (poidsInitial !== undefined) updateData.poidsInitial = poidsInitial;

        await user.update(updateData);

        // 4. Retourner le profil mis à jour
        const updatedUser = await User.findByPk(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Profil mis à jour avec succès",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMe, updateProfile };
