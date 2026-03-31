const jwt = require("jsonwebtoken");
const { User, ActivityLog, sequelize } = require("../models");
const { validateRegister } = require("../validators/user.validator");
const { sendWelcomeEmail } = require("../services/email.service");

const log = (type, { utilisateur_id = null, email = null, ip = null, details = null } = {}) => {
  ActivityLog.create({ type, utilisateur_id, email, ip, details }).catch(() => {});
};

/**
 * Génère un JWT pour un utilisateur.
 */
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role || 'user' },
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

        const { prenom, nom, email, motDePasse, telephone, dateNaissance, age, poidsInitial, taille } = req.body;

        // 2. Vérification email existant
        const existingUser = await User.scope("withPassword").findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Cet email est déjà utilisé",
            });
        }

        // 3. Création utilisateur (le hook hashera le mot de passe)
        const newUser = await User.create({ prenom, nom, email, motDePasse, telephone, dateNaissance, age, poidsInitial, taille: taille ? Number(taille) : null });

        // 4. Générer JWT
        const token = generateToken(newUser);

        // 5. Retourner l'utilisateur sans motDePasse
        const userResponse = await User.findByPk(newUser.id);

        // Réponse immédiate — l'email est envoyé en arrière-plan
        res.status(201).json({
            success: true,
            message: "Inscription réussie",
            user: userResponse,
            token,
        });

        // Email de bienvenue (non-bloquant, n'affecte pas l'inscription)
        sendWelcomeEmail({ prenom, nom, email });
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

        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || null;

        // 1. Trouver l'utilisateur avec le mot de passe
        const user = await User.scope("withPassword").findOne({ where: { email } });
        if (!user) {
            log('LOGIN_FAILED', { email, ip, details: 'Email inconnu' });
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect",
            });
        }

        // 2. Comparer le mot de passe
        const isMatch = await user.comparePassword(motDePasse);
        if (!isMatch) {
            log('LOGIN_FAILED', { email, ip, utilisateur_id: user.id, details: 'Mot de passe incorrect' });
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect",
            });
        }

        // 2b. Vérifier si le compte est banni
        if (user.banni) {
            log('LOGIN_FAILED', { email, ip, utilisateur_id: user.id, details: 'Compte banni' });
            return res.status(403).json({
                success: false,
                message: "Votre compte a été suspendu. Contactez l'administrateur.",
            });
        }

        // 3. Générer JWT
        const token = generateToken(user);

        // 4. Retourner sans motDePasse
        const userResponse = await User.findByPk(user.id);

        log('LOGIN', { email, ip, utilisateur_id: user.id, details: `Rôle: ${user.role}` });

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

const logout = async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || null;
    log('LOGOUT', { utilisateur_id: req.user?.id, email: req.user?.email, ip });
    res.json({ success: true });
};

module.exports = { register, login, logout };
