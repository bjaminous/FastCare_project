/**
 * Validateurs d'entrée utilisateur.
 * Retournent { valid: boolean, errors: string[] }.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valide les données d'inscription.
 */
function validateRegister(body) {
    const errors = [];

    if (!body.nom || typeof body.nom !== "string" || body.nom.trim().length < 2) {
        errors.push("Le nom est requis et doit contenir au moins 2 caractères");
    }

    if (!body.email || !EMAIL_REGEX.test(body.email)) {
        errors.push("Un email valide est requis");
    }

    if (!body.motDePasse || typeof body.motDePasse !== "string" || body.motDePasse.length < 6) {
        errors.push("Le mot de passe est requis et doit contenir au moins 6 caractères");
    }

    if (body.age !== undefined && body.age !== null) {
        if (typeof body.age !== "number" || body.age < 10) {
            errors.push("L'âge doit être un nombre supérieur ou égal à 10");
        }
    }

    if (body.taille !== undefined && body.taille !== null) {
        const t = Number(body.taille);
        if (isNaN(t) || t < 50 || t > 250) {
            errors.push("La taille doit être comprise entre 50 et 250 cm");
        }
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Valide les données de mise à jour du profil.
 */
function validateUpdate(body) {
    const errors = [];

    if (body.nom !== undefined) {
        if (typeof body.nom !== "string" || body.nom.trim().length < 2) {
            errors.push("Le nom doit contenir au moins 2 caractères");
        }
    }

    if (body.age !== undefined && body.age !== null) {
        if (typeof body.age !== "number" || body.age < 10) {
            errors.push("L'âge doit être un nombre supérieur ou égal à 10");
        }
    }

    if (body.poidsInitial !== undefined && body.poidsInitial !== null) {
        if (typeof body.poidsInitial !== "number" || body.poidsInitial <= 0) {
            errors.push("Le poids doit être un nombre positif");
        }
    }

    if (body.taille !== undefined && body.taille !== null) {
        const t = Number(body.taille);
        if (isNaN(t) || t < 50 || t > 250) {
            errors.push("La taille doit être comprise entre 50 et 250 cm");
        }
    }

    return { valid: errors.length === 0, errors };
}

module.exports = { validateRegister, validateUpdate };
