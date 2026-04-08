// Articles proposés selon l'âge du bébé
// Chaque article a une plage d'âge en jours

export const ARTICLES = [
  // Naissance - J14
  { id: "retour_maison", ficheId: null, catId: "post-partum", minDays: 0, maxDays: 14, categorie: "post-partum", emoji: "🏠", titre: "Le retour à la maison", resume: "Les premiers jours chez soi avec un nouveau-né — ce qui t'attend vraiment.", priorite: 1 },
  { id: "montee_lait", ficheId: "engorgement", catId: "allaitement", minDays: 0, maxDays: 7, categorie: "allaitement", emoji: "🤱", titre: "La montée de lait", resume: "Quand elle arrive, comment la vivre, l'engorgement.", priorite: 1 },
  { id: "peau_a_peau", ficheId: null, catId: "allaitement", minDays: 0, maxDays: 30, categorie: "lien", emoji: "🫂", titre: "Le peau à peau", resume: "Bien plus que du confort — des effets physiologiques documentés.", priorite: 1 },
  { id: "meconium", ficheId: "selles_couleurs", catId: null, minDays: 0, maxDays: 5, categorie: "corps bébé", emoji: "💩", titre: "Les selles du nouveau-né", resume: "Du méconium noir au jaune moutarde — le guide complet.", priorite: 2 },

  // J14 - 6 semaines
  { id: "pic_pleurs", ficheId: "pleurs_5etrimestre", catId: null, minDays: 10, maxDays: 70, categorie: "pleurs", emoji: "😢", titre: "Le pic de pleurs à 6 semaines", resume: "Pourquoi ça s'intensifie, pourquoi ça passe, comment tenir.", priorite: 1 },
  { id: "baby_blues", ficheId: null, catId: "post-partum", minDays: 3, maxDays: 21, categorie: "post-partum", emoji: "🌸", titre: "Baby blues ou dépression ?", resume: "Reconnaître la différence, quand consulter.", priorite: 1 },
  { id: "cluster_feeding", ficheId: "agite", catId: "allaitement", minDays: 7, maxDays: 60, categorie: "allaitement", emoji: "⏰", titre: "Le cluster feeding", resume: "Ces soirées où bébé tète sans arrêt — c'est normal et nécessaire.", priorite: 1 },
  { id: "matrescence", ficheId: "pp_matrescence", catId: null, minDays: 7, maxDays: 60, categorie: "post-partum", emoji: "🦋", titre: "La matrescence", resume: "Tu ne te reconnais plus ? C'est normal. Tu es en train de naître mère.", priorite: 2 },

  // 6 semaines - 3 mois
  { id: "smile_social", ficheId: null, catId: null, minDays: 35, maxDays: 70, categorie: "développement", emoji: "😊", titre: "Le premier vrai sourire", resume: "Comment le reconnaître et pourquoi il change tout.", priorite: 2 },
  { id: "cododo_securise", ficheId: "sommeil_cosleeping", catId: null, minDays: 0, maxDays: 180, categorie: "sommeil", emoji: "🌙", titre: "Cododo sécurisé", resume: "Les 7 critères SAFE, les bénéfices, les idées reçues.", priorite: 1 },
  { id: "portage_intro", ficheId: "portage_bases", catId: null, minDays: 0, maxDays: 120, categorie: "portage", emoji: "🧣", titre: "Commencer le portage", resume: "Écharpe ou porte-bébé ? Comment choisir selon l'âge.", priorite: 2 },
  { id: "reprise_travail_prep", ficheId: null, catId: "post-partum", minDays: 60, maxDays: 120, categorie: "post-partum", emoji: "💼", titre: "Préparer la reprise du travail", resume: "Garde, allaitement au retour, gestion émotionnelle.", priorite: 2 },

  // 3-6 mois
  { id: "regression_4mois", ficheId: "sommeil_cycles", catId: null, minDays: 100, maxDays: 140, categorie: "sommeil", emoji: "😴", titre: "La régression du sommeil à 4 mois", resume: "Pourquoi ça arrive, combien de temps ça dure, comment survivre.", priorite: 1 },
  { id: "motricite_libre", ficheId: null, catId: null, minDays: 60, maxDays: 180, categorie: "développement", emoji: "🌱", titre: "La motricité libre", resume: "Pas de trotteur, pas d'assiste-assis — pourquoi et quoi faire à la place.", priorite: 1 },
  { id: "sevrage_progressif", ficheId: null, catId: "allaitement", minDays: 90, maxDays: 180, categorie: "allaitement", emoji: "🍼", titre: "Introduire le biberon à côté de l'allaitement", resume: "Sans compromettre la lactation, selon le projet de la maman.", priorite: 2 },

  // 4-6 mois
  { id: "signes_diversification", ficheId: "dme_intro", catId: null, minDays: 140, maxDays: 200, categorie: "alimentation", emoji: "🥕", titre: "Les signes de prêt pour la diversification", resume: "Tient assis, réflexe d'extrusion, intérêt — les 3 critères.", priorite: 1 },
  { id: "dme_intro", ficheId: "dme_intro", catId: null, minDays: 160, maxDays: 210, categorie: "alimentation", emoji: "🥑", titre: "DME — par où commencer", resume: "Les premiers aliments, les textures, gérer les haut-le-cœur.", priorite: 1 },
  { id: "allergenes", ficheId: "dme_allergenes", catId: null, minDays: 155, maxDays: 210, categorie: "alimentation", emoji: "⚠️", titre: "Introduire les allergènes", resume: "Leçuels, dans quel ordre, à quelle fréquence — les recommandations actuelles.", priorite: 1 },

  // 6-12 mois
  { id: "separation_anxiety", ficheId: "pleurs_decryptage", catId: null, minDays: 240, maxDays: 330, categorie: "développement", emoji: "👋", titre: "L'angoisse de séparation", resume: "Vers 8-9 mois c'est intense — pourquoi c'est un bon signe.", priorite: 1 },
  { id: "premiers_mots", ficheId: null, catId: null, minDays: 240, maxDays: 365, categorie: "développement", emoji: "💬", titre: "Les premiers mots", resume: "Comment stimuler le langage, ce qui est normal, ce qui alerte.", priorite: 2 },
  { id: "nuit_complete", ficheId: "sommeil_ferber", catId: "sommeil", minDays: 180, maxDays: 365, categorie: "sommeil", emoji: "⭐", titre: "Vers la nuit complète", resume: "Sans méthode de pleurs — les approches douces qui fonctionnent.", priorite: 2 },

  // 12-24 mois
  { id: "crise_opposition", ficheId: null, catId: "post-partum", minDays: 365, maxDays: 730, categorie: "développement", emoji: "🌋", titre: "Les crises d'opposition", resume: "Ce qui se passe dans le cerveau de bébé, comment y répondre.", priorite: 1 },
  { id: "diversif_avancee", ficheId: "dme_intro", catId: "DME", minDays: 300, maxDays: 540, categorie: "alimentation", emoji: "🍽", titre: "Table familiale et texture morceaux", resume: "Passer aux repas en famille, gérer la néophobie.", priorite: 2 },
  { id: "sevrage_allait", ficheId: null, catId: "allaitement", minDays: 365, maxDays: 730, categorie: "allaitement", emoji: "🤍", titre: "Sevrage en douceur", resume: "Quand c'est le bon moment, comment procéder sans douleur.", priorite: 2 },
];

export function getArticlesPourAge(ageDays, limit = 5) {
  return ARTICLES
    .filter(a => ageDays >= a.minDays && ageDays < a.maxDays)
    .sort((a, b) => a.priorite - b.priorite)
    .slice(0, limit);
}
