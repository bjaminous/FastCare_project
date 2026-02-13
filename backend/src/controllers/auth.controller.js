const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validateRegister } = require("../validators/user.validator");

/**
 * Génère un JWT pour un utilisateur.
 */
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur.
 */
const register = async (req, res, next) => {
    try {
        // 1. Validation des données
        const { valid, errors } = validateRegister(req.body);
        if (!valid) {
            return res.status(400).json({ success: false, message: "Données invalides", errors });
        }

        const { nom, email, motDePasse, age, poidsInitial } = req.body;

        // 2. Vérification email existant
        const existingUser = await User.scope("withPassword").findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Cet email est déjà utilisé",
            });
        }

        // 3. Création utilisateur (le hook hashera le mot de passe)
        const newUser = await User.create({ nom, email, motDePasse, age, poidsInitial });

        // 4. Générer JWT
        const token = generateToken(newUser);

        // 5. Retourner l'utilisateur sans motDePasse
        const userResponse = await User.findByPk(newUser.id);

        return res.status(201).json({
            success: true,
            message: "Inscription réussie",
            user: userResponse,
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur existant.
 */
const login = async (req, res, next) => {
    try {
        const { email, motDePasse } = req.body;

        if (!email || !motDePasse) {
            return res.status(400).json({
                success: false,
                message: "Email et mot de passe requis",
            });
        }

        // 1. Trouver l'utilisateur avec le mot de passe
        const user = await User.scope("withPassword").findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect",
            });
        }

        // 2. Comparer le mot de passe
        const isMatch = await user.comparePassword(motDePasse);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect",
            });
        }

        // 3. Générer JWT
        const token = generateToken(user);

        // 4. Retourner sans motDePasse
        const userResponse = await User.findByPk(user.id);

        return res.status(200).json({
            success: true,
            message: "Connexion réussie",
            user: userResponse,
            token,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
