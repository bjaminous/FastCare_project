const nodemailer = require('nodemailer');

/**
 * Crée le transporteur SMTP à partir des variables d'environnement.
 * Compatible Gmail, Outlook, ou tout serveur SMTP.
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Envoie l'email de bienvenue après inscription.
 * Ne lève jamais d'exception — log uniquement en cas d'erreur.
 */
async function sendWelcomeEmail({ prenom, nom, email }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[FastCare] Email non configuré (EMAIL_USER ou EMAIL_PASS manquant)');
    return;
  }

  const displayName = prenom || nom || 'cher utilisateur';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue sur FastCare</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFF;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFF;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td align="center" style="padding-bottom:24px;">
          <span style="font-size:2rem;font-weight:900;background:linear-gradient(135deg,#2A7DE1,#2ED1A2);-webkit-background-clip:text;color:#2A7DE1;letter-spacing:-0.03em;">
            FastCare
          </span>
        </td></tr>

        <!-- Carte principale -->
        <tr><td style="background:#ffffff;border-radius:24px;padding:40px 36px;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Emoji -->
          <p style="font-size:3.5rem;text-align:center;margin:0 0 16px;">🎉</p>

          <!-- Titre -->
          <h1 style="font-size:1.8rem;font-weight:900;color:#0F172A;text-align:center;margin:0 0 8px;letter-spacing:-0.02em;">
            Bienvenue, ${displayName} !
          </h1>
          <p style="text-align:center;color:#64748b;font-size:0.95rem;margin:0 0 28px;">
            Votre compte FastCare a bien été créé.
          </p>

          <!-- Séparateur -->
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 28px;" />

          <!-- Corps -->
          <p style="color:#374151;font-size:0.95rem;line-height:1.75;margin:0 0 16px;">
            Nous sommes ravis de vous accueillir sur <strong>FastCare</strong>, votre compagnon de jeûne personnalisé.
          </p>
          <p style="color:#374151;font-size:0.95rem;line-height:1.75;margin:0 0 28px;">
            D'après votre profil, nous vous avons sélectionné le type de jeûne le plus adapté à votre bien-être.
            Vous pouvez le modifier à tout moment depuis <strong>Mon Espace</strong>.
          </p>

          <!-- Fonctionnalités -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="background:#F0F7FF;border-radius:12px;padding:14px 16px;vertical-align:top;width:30%;">
                <p style="font-size:1.4rem;margin:0 0 6px;text-align:center;">⏱️</p>
                <p style="font-size:0.78rem;font-weight:700;color:#2A7DE1;text-align:center;margin:0;">Timer de jeûne</p>
              </td>
              <td style="width:8px;"></td>
              <td style="background:#F0FDF7;border-radius:12px;padding:14px 16px;vertical-align:top;width:30%;">
                <p style="font-size:1.4rem;margin:0 0 6px;text-align:center;">📊</p>
                <p style="font-size:0.78rem;font-weight:700;color:#059669;text-align:center;margin:0;">Statistiques</p>
              </td>
              <td style="width:8px;"></td>
              <td style="background:#FFF7ED;border-radius:12px;padding:14px 16px;vertical-align:top;width:30%;">
                <p style="font-size:1.4rem;margin:0 0 6px;text-align:center;">🌙</p>
                <p style="font-size:0.78rem;font-weight:700;color:#D97706;text-align:center;margin:0;">Contenus Ramadan</p>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <p style="text-align:center;margin:0;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}"
               style="display:inline-block;background:linear-gradient(135deg,#2A7DE1,#2ED1A2);color:#ffffff;font-weight:800;font-size:0.97rem;padding:14px 32px;border-radius:14px;text-decoration:none;letter-spacing:0.01em;">
              Accéder à mon espace →
            </a>
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="font-size:0.78rem;color:#94a3b8;margin:0;line-height:1.6;">
            Vous recevez cet email car vous venez de vous inscrire sur FastCare.<br />
            Si ce n'est pas vous, ignorez simplement ce message.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const transporter = createTransporter();

    // Vérification connexion SMTP avant envoi
    await transporter.verify();

    await transporter.sendMail({
      // Gmail exige que le from corresponde exactement à EMAIL_USER
      from:    `"FastCare" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: `Bienvenue sur FastCare, ${displayName} ! 🎉`,
      html,
    });

    console.log(`[FastCare] Email de bienvenue envoyé à ${email}`);
  } catch (err) {
    console.error('[FastCare] Échec envoi email bienvenue :', err.message);
    console.error('[FastCare] Vérifiez EMAIL_HOST, EMAIL_USER, EMAIL_PASS dans .env');
  }
}

/**
 * Envoie un email de rappel hydratation avec un conseil santé.
 * Non-bloquant — log uniquement en cas d'erreur.
 */
async function sendWaterReminderEmail({ prenom, nom, email, hour, conseil }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const displayName = prenom || nom || 'cher utilisateur';

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F0F7FF;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F7FF;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <tr><td align="center" style="padding-bottom:20px;">
          <span style="font-size:1.8rem;font-weight:900;color:#2A7DE1;letter-spacing:-0.03em;">FastCare</span>
        </td></tr>

        <tr><td style="background:#fff;border-radius:24px;padding:36px 32px;box-shadow:0 4px 20px rgba(42,125,225,0.1);">

          <p style="font-size:3rem;text-align:center;margin:0 0 12px;">💧</p>

          <h1 style="font-size:1.5rem;font-weight:900;color:#0F172A;text-align:center;margin:0 0 6px;letter-spacing:-0.02em;">
            Rappel hydratation
          </h1>
          <p style="text-align:center;color:#64748b;font-size:0.9rem;margin:0 0 24px;">
            ${hour}h de jeûne en cours — restez hydraté(e) !
          </p>

          <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 24px;"/>

          <p style="color:#374151;font-size:0.95rem;line-height:1.75;margin:0 0 8px;">
            Bonjour <strong>${displayName}</strong>,
          </p>
          <p style="color:#374151;font-size:0.95rem;line-height:1.75;margin:0 0 20px;">
            Vous jeûnez depuis <strong>${hour} heures</strong>. Pensez à boire un grand verre d'eau pour maintenir votre énergie et votre concentration.
          </p>

          <!-- Conseil du moment -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="background:linear-gradient(135deg,rgba(42,125,225,0.06),rgba(46,209,162,0.06));
                         border:1.5px solid rgba(42,125,225,0.15);border-radius:16px;padding:18px 20px;">
                <p style="font-size:0.75rem;font-weight:700;color:#2A7DE1;text-transform:uppercase;
                           letter-spacing:0.08em;margin:0 0 8px;">💡 Conseil du moment</p>
                <p style="font-size:0.92rem;color:#1e293b;line-height:1.65;margin:0;font-weight:500;">
                  ${conseil}
                </p>
              </td>
            </tr>
          </table>

          <p style="text-align:center;margin:0;">
            <a href="${process.env.APP_URL || 'http://localhost:5173'}/timer"
               style="display:inline-block;background:linear-gradient(135deg,#2A7DE1,#2ED1A2);
                      color:#fff;font-weight:800;font-size:0.92rem;
                      padding:12px 28px;border-radius:12px;text-decoration:none;">
              Voir mon timer →
            </a>
          </p>

        </td></tr>

        <tr><td style="padding:20px 0 0;text-align:center;">
          <p style="font-size:0.75rem;color:#94a3b8;margin:0;line-height:1.6;">
            Rappel automatique FastCare · Vous pouvez continuer votre jeûne sereinement.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from:    `"FastCare 💧" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: `💧 ${hour}h de jeûne — Pensez à vous hydrater !`,
      html,
    });
    console.log(`[FastCare] Email hydratation envoyé à ${email} (${hour}h)`);
  } catch (err) {
    console.error('[FastCare] Échec email hydratation :', err.message);
  }
}

module.exports = { sendWelcomeEmail, sendWaterReminderEmail };
