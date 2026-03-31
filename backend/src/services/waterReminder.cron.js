/**
 * Cron job — Rappels hydratation côté serveur
 *
 * Toutes les 30 minutes, on vérifie tous les jeûnes EN_COURS.
 * Pour chaque jeûne actif, on calcule le nombre d'heures écoulées
 * et on envoie un rappel tous les 2h (si pas encore envoyé pour cette tranche).
 *
 * La colonne `derniersRappels` (JSON) dans la table Jeune stocke les heures déjà notifiées
 * → pas de rappel en doublon même si le cron tourne souvent.
 */

const cron = require('node-cron');
const { Jeune, User, Notification } = require('../models');
const { Op } = require('sequelize');
const { sendWaterReminderEmail } = require('./email.service');

const WATER_CONSEILS = [
  "L'eau à température ambiante est mieux absorbée par l'organisme que l'eau très froide.",
  "Ajoutez une pincée de sel de mer à votre eau pour maintenir l'équilibre électrolytique.",
  "Le thé vert sans sucre est autorisé pendant le jeûne et stimule la combustion des graisses.",
  "Boire de l'eau avant de ressentir la faim aide souvent à distinguer faim et soif.",
  "L'eau pétillante sans sucre peut réduire la sensation de faim et faciliter le jeûne.",
  "Le café noir sans sucre est autorisé et peut soutenir l'énergie durant le jeûne.",
  "Une bonne hydratation améliore la concentration et réduit les maux de tête liés au jeûne.",
  "Visez 250 à 300 ml d'eau à chaque rappel pour rester bien hydraté(e) tout au long du jeûne.",
  "Les tisanes non sucrées (camomille, menthe) sont idéales pour varier votre hydratation.",
  "L'eau citronnée (sans sucre) aide à alcaliniser le corps et à soutenir la détoxification.",
];

// Limite max de rappels : au-delà de 48h EN_COURS → jeûne probablement oublié
const MAX_JEUNE_HEURES = 48;
// Nombre max de rappels envoyés par exécution du cron (anti-spam)
const MAX_RAPPELS_PAR_CRON = 3;

async function checkAndSendReminders() {
  try {
    const jeunes = await Jeune.findAll({
      where: { statut: 'EN_COURS' },
      include: [{ model: User, foreignKey: 'utilisateur_id' }],
    });

    if (!jeunes.length) return;

    const now = new Date();

    for (const jeune of jeunes) {
      const user = jeune.User || jeune.Utilisateur;
      if (!user) continue;

      const heuresEcoulees = Math.floor((now - new Date(jeune.dateDebut)) / 3600000);

      // Jeûne trop long (oublié / données de test) → on le termine automatiquement
      if (heuresEcoulees > MAX_JEUNE_HEURES) {
        await jeune.update({ statut: 'TERMINE', dateFin: now });
        console.log(`[Cron] Jeûne #${jeune.id} (${heuresEcoulees}h) auto-terminé — dépassement limite`);
        continue;
      }

      if (heuresEcoulees < 2) continue;

      let dejaNotiflies = [];
      try { dejaNotiflies = JSON.parse(jeune.rappelsEnvoyes || '[]'); } catch { dejaNotiflies = []; }

      // Collecte les tranches dues mais pas encore envoyées
      const tranchesDues = [];
      for (let h = 2; h <= heuresEcoulees; h += 2) {
        if (!dejaNotiflies.includes(h)) tranchesDues.push(h);
      }

      if (!tranchesDues.length) continue;

      // On envoie seulement les MAX_RAPPELS_PAR_CRON tranches les plus récentes
      // (évite le rattrapage massif si le serveur était éteint)
      const aEnvoyer = tranchesDues.slice(-MAX_RAPPELS_PAR_CRON);

      // Marquer TOUTES les tranches manquées comme "vues" (pas juste celles envoyées)
      // pour éviter le rattrapage au prochain cron
      const toutesMarquees = [...dejaNotiflies, ...tranchesDues];

      for (const h of aEnvoyer) {
        const conseilIndex = (h / 2 - 1) % WATER_CONSEILS.length;
        const conseil = WATER_CONSEILS[conseilIndex];
        const message = `💧 ${h}h de jeûne — Buvez un verre d'eau ! Conseil : ${conseil}`;

        // Notif in-app
        await Notification.create({
          utilisateur_id: user.id,
          type: 'HYDRATATION',
          message,
          dateEnvoi: new Date(),
          lue: false,
        });

        // Email (séquentiel pour éviter le flood Gmail)
        if (user.email) {
          try {
            await sendWaterReminderEmail({ prenom: user.prenom, nom: user.nom, email: user.email, hour: h, conseil });
          } catch { /* silencieux */ }
        }

        console.log(`[Cron] Rappel hydratation → ${user.email} (${h}h)`);
      }

      await jeune.update({ rappelsEnvoyes: JSON.stringify(toutesMarquees) });
    }
  } catch (err) {
    console.error('[Cron] Erreur rappels hydratation :', err.message);
  }
}

function startWaterReminderCron() {
  // Tourne toutes les 30 minutes
  cron.schedule('*/30 * * * *', () => {
    console.log('[Cron] Vérification rappels hydratation...');
    checkAndSendReminders();
  });

  // Exécution immédiate au démarrage pour rattraper les jeûnes en cours
  checkAndSendReminders();

  console.log('⏰ Cron rappels hydratation démarré (toutes les 30 min)');
}

module.exports = { startWaterReminderCron };
