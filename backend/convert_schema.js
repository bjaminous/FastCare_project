const fs = require('fs');
const crypto = require('crypto');

const file = 'd:/Codes/FastCare_project/backend/schema.sql';
let content = fs.readFileSync(file, 'utf8');

// Générer des UUIDs sécurisés
const uuid_u0 = crypto.randomUUID();
const uuid_u1 = crypto.randomUUID();
const uuid_u2 = crypto.randomUUID();
const uuid_u3 = crypto.randomUUID();
const uuid_u4 = crypto.randomUUID();

const uuid_j1 = crypto.randomUUID();
const uuid_j2 = crypto.randomUUID();

const uuid_jo1 = crypto.randomUUID();

const uuid_n1 = crypto.randomUUID();
const uuid_n2 = crypto.randomUUID();
const uuid_n3 = crypto.randomUUID();

const uuid_s1 = crypto.randomUUID();

// 1. Remplacements des CREATE TABLE (Colonnes id)
content = content.replace(/`id` int\(11\) NOT NULL/g, '`id` varchar(36) NOT NULL');
content = content.replace(/`utilisateur_id` int\(11\)/g, '`utilisateur_id` varchar(36)');
content = content.replace(/`conseil_id` int\(11\)/g, '`conseil_id` varchar(36)');
content = content.replace(/`type_jeune_id` int\(11\)/g, '`type_jeune_id` varchar(36)');
content = content.replace(/`TypeJeuneId` int\(11\)/g, '`TypeJeuneId` varchar(36)');
content = content.replace(/`jeune_id` int\(11\)/g, '`jeune_id` varchar(36)');
content = content.replace(/`JeuneId` int\(11\)/g, '`JeuneId` varchar(36)');

// 2. Retrait des blocs AUTO_INCREMENT
// Remplacer "MODIFY `id` int(11) NOT NULL AUTO_INCREMENT" et ses variantes par rien.
// En fait, on peut carrément enlever les lignes ou le bloc entier AUTO_INCREMENT.
// Les MODIFY s'appliquaient aux id. Puisqu'on a enlevé AUTO_INCREMENT, cette section ne sert plus à rien.
// On va juste nettoyer la section :
content = content.replace(/AUTO_INCREMENT pour la table `.*`\n--\nALTER TABLE `.*`\n  MODIFY `id` int\(11\) NOT NULL AUTO_INCREMENT.*?;/g, '');
content = content.replace(/--\n-- AUTO_INCREMENT pour les tables déchargées\n--/g, '');


// 3. Mise à jour des inserts.
// INSERT INTO `jeunes` (`id`, `dateDebut`, `dateFin`, `statut`, `createdAt`, `updatedAt`, `utilisateur_id`, `TypeJeuneId`) VALUES
content = content.replace(
  /\(1, '2026-03-14 23:27:20', NULL, 'EN_COURS', '2026-03-14 23:27:20', '2026-03-14 23:27:20', 1000, NULL\),/g,
  `('${uuid_j1}', '2026-03-14 23:27:20', NULL, 'EN_COURS', '2026-03-14 23:27:20', '2026-03-14 23:27:20', '${uuid_u1}', NULL),`
);
content = content.replace(
  /\(2, '2026-03-15 01:36:03', NULL, 'EN_COURS', '2026-03-15 01:36:03', '2026-03-15 01:36:03', 1001, NULL\);/g,
  `('${uuid_j2}', '2026-03-15 01:36:03', NULL, 'EN_COURS', '2026-03-15 01:36:03', '2026-03-15 01:36:03', '${uuid_u2}', NULL);`
);

// INSERT INTO `journals` (`id`, `date`, `contenu`, `createdAt`, `updatedAt`, `utilisateur_id`) VALUES
content = content.replace(
  /\(1, '2026-03-14', 'C\\'était abordable mais vers la fin j\\'avais la gorge sèche.', '2026-03-14 20:16:09', '2026-03-14 20:16:09', 0\);/g,
  `('${uuid_jo1}', '2026-03-14', 'C\\'était abordable mais vers la fin j\\'avais la gorge sèche.', '2026-03-14 20:16:09', '2026-03-14 20:16:09', '${uuid_u4}');`
);

// INSERT INTO `notifications` (`id`, `type`, `message`, `dateEnvoi`, `lue`, `utilisateur_id`) VALUES
content = content.replace(
  /\(1, 'BIENVENUE', 'Bienvenue sur FastCare, Fanta ! 👋 Commencez par choisir votre objectif.', '2026-03-14 22:57:42', 0, 1000\),/g,
  `('${uuid_n1}', 'BIENVENUE', 'Bienvenue sur FastCare, Fanta ! 👋 Commencez par choisir votre objectif.', '2026-03-14 22:57:42', 0, '${uuid_u1}'),`
);
content = content.replace(
  /\(2, 'BIENVENUE', 'Bienvenue sur FastCare, Nana ! 👋 Commencez par choisir votre objectif.', '2026-03-14 23:33:27', 1, 1001\),/g,
  `('${uuid_n2}', 'BIENVENUE', 'Bienvenue sur FastCare, Nana ! 👋 Commencez par choisir votre objectif.', '2026-03-14 23:33:27', 1, '${uuid_u2}'),`
);
content = content.replace(
  /\(3, 'BIENVENUE', 'Bienvenue sur FastCare, Chérif ! 👋 Commencez par choisir votre objectif.', '2026-03-15 00:44:52', 0, 1002\);/g,
  `('${uuid_n3}', 'BIENVENUE', 'Bienvenue sur FastCare, Chérif ! 👋 Commencez par choisir votre objectif.', '2026-03-15 00:44:52', 0, '${uuid_u3}');`
);

// INSERT INTO `suiviquotidiens` (`id`, `date`, `poids`, `energie`, `humeur`, `createdAt`, `updatedAt`, `utilisateur_id`, `JeuneId`) VALUES
content = content.replace(
  /\(1, '2026-03-14', 70, 7, 'fatigue', '2026-03-14 20:15:14', '2026-03-14 20:15:14', 0, NULL\);/g,
  `('${uuid_s1}', '2026-03-14', 70, 7, 'fatigue', '2026-03-14 20:15:14', '2026-03-14 20:15:14', '${uuid_u4}', NULL);`
);

// INSERT INTO `utilisateur` (`id`, `nom`, `email`, `motDePasse`, `age`, `poidsInitial`, `dateInscription`, `prenom`, `telephone`, `dateNaissance`) VALUES
content = content.replace(
  /\(1, 'SIDIBÉ', 'sidibefatoumataditetima@gmail.com', '\$2b\$10\$em4i0Eo2r1DkyIFblCLfoeFvKbKv71z2Ljltod4kty2rfzWpW7SYu', 20, 71, '2026-03-14', 'FATOUMATA DITE TIMA', '0744257875', '2006-01-22'\),/g,
  `('${uuid_u0}', 'SIDIBÉ', 'sidibefatoumataditetima@gmail.com', '$2b$10$em4i0Eo2r1DkyIFblCLfoeFvKbKv71z2Ljltod4kty2rfzWpW7SYu', 20, 71, '2026-03-14', 'FATOUMATA DITE TIMA', '0744257875', '2006-01-22'),`
);
content = content.replace(
  /\(1000, 'Tangara', 'aguiboutangara94@gmail.com', '\$2b\$10\$yjuPvuifin4TyYphRjH\.Ke9CKwAla\.MXgHauYTEsNWlUaQnI8CYCW', NULL, 90, '2026-03-14', 'Fanta', '\+33623891203', '2006-05-18'\),/g,
  `('${uuid_u1}', 'Tangara', 'aguiboutangara94@gmail.com', '$2b$10$yjuPvuifin4TyYphRjH.Ke9CKwAla.MXgHauYTEsNWlUaQnI8CYCW', NULL, 90, '2026-03-14', 'Fanta', '+33623891203', '2006-05-18'),`
);
content = content.replace(
  /\(1001, 'Diarra', 'timasidibe080@gmail.com', '\$2b\$10\$RkwnkRyjoDmUM2H292gwl\.0Ee9yd5mJPkhNKb\.6GE4ImWQaWDIcGW', NULL, 50, '2026-03-15', 'Nana', '\+33771842831', '2016-04-20'\),/g,
  `('${uuid_u2}', 'Diarra', 'timasidibe080@gmail.com', '$2b$10$RkwnkRyjoDmUM2H292gwl.0Ee9yd5mJPkhNKb.6GE4ImWQaWDIcGW', NULL, 50, '2026-03-15', 'Nana', '+33771842831', '2016-04-20'),`
);
content = content.replace(
  /\(1002, 'SIDIBE', 'cherif@gmail.com', '\$2b\$10\$ibJI4c69GXx0WP3F\/\.OmSu\.mjuhg1PHt5od2ElEstjd\/0\/Yjm9zq2', NULL, 30, '2026-03-15', 'Chérif', '\+33771842835', '2015-02-05'\);/g,
  `('${uuid_u3}', 'SIDIBE', 'cherif@gmail.com', '$2b$10$ibJI4c69GXx0WP3F/.OmSu.mjuhg1PHt5od2ElEstjd/0/Yjm9zq2', NULL, 30, '2026-03-15', 'Chérif', '+33771842835', '2015-02-05');`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fichier SQL mis à jour avec succès');
