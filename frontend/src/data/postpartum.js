// Données post-partum — contenu Alma
// Non médical — à titre informatif uniquement

export const CHECKIN_MOODS = [
  { id: 0, emoji: "😔", label: "Difficile", score: 0 },
  { id: 1, emoji: "😐", label: "Bof", score: 1 },
  { id: 2, emoji: "🙂", label: "Ça va", score: 2 },
  { id: 3, emoji: "😊", label: "Bien", score: 3 },
  { id: 4, emoji: "🌟", label: "Super", score: 4 },
];

// Seuils de détection douce — pas un outil médical
// Score moyen sur 7 jours
export const evaluerHumeur = (scores7j) => {
  if (scores7j.length < 3) return null;
  const moyenne = scores7j.reduce((a, b) => a + b, 0) / scores7j.length;
  const tendanceDescendante = scores7j.length >= 5 &&
    scores7j.slice(-3).every((s, i, arr) => i === 0 || s <= arr[i - 1]);

  if (moyenne < 1 && tendanceDescendante) return "alerte";
  if (moyenne < 1.5) return "attention";
  if (moyenne < 2) return "vigilance";
  return "ok";
};

export const MESSAGES_SOUTIEN = {
  ok: null,
  vigilance: {
    message: "Cette semaine semble un peu pesante. C'est normal — les premières semaines sont intenses. Tu n'as pas à tout gérer seule.",
    action: "Parle à quelqu'un de confiance aujourd'hui, même juste 10 minutes.",
  },
  attention: {
    message: "Tu traverses une période difficile. Ce que tu ressens est réel et valide. Le post-partum peut être épuisant physiquement et émotionnellement.",
    action: "Considère d'en parler à ta sage-femme ou ton médecin lors de ta prochaine visite.",
    ressources: true,
  },
  alerte: {
    message: "Plusieurs jours difficiles d'affilée méritent attention. Tu n'es pas seule — et ce n'est pas un échec de ne pas aller bien.",
    action: "Je t'encourage vraiment à appeler ton médecin ou ta sage-femme. Tu mérites d'être soutenue.",
    ressources: true,
    urgence: true,
  },
};

export const RESSOURCES_SOUTIEN = [
  {
    nom: "Numéro national prévention suicide",
    tel: "3114",
    disponible: "24h/24, 7j/7",
    description: "Écoute et soutien en cas de détresse",
  },
  {
    nom: "Maman Blues",
    url: "https://www.maman-blues.fr",
    description: "Association d'aide aux mamans en souffrance post-natale",
    tel: null,
  },
  {
    nom: "La Leche League France",
    url: "https://www.lllfrance.org",
    description: "Soutien allaitement + écoute bienveillante",
    tel: null,
  },
];

// Questionnaire Édimbourg simplifié — version non diagnostique
// Présenter à J+15, J+30, J+60
export const EDINBURGH_QUESTIONS = [
  { id: 1, texte: "J'ai été capable de rire et de voir le bon côté des choses", inverse: true },
  { id: 2, texte: "Je me suis sentie anxieuse ou inquiète sans raison valable", inverse: false },
  { id: 3, texte: "Je me suis sentie effrayée ou paniquée sans raison valable", inverse: false },
  { id: 4, texte: "Les choses me semblaient dépassées ou m'accablaient", inverse: false },
  { id: 5, texte: "J'ai eu du mal à dormir même quand le bébé dormait", inverse: false },
  { id: 6, texte: "Je me suis sentie triste ou malheureuse", inverse: false },
  { id: 7, texte: "J'ai pleuré à cause de ma tristesse", inverse: false },
  { id: 8, texte: "J'ai pensé à me faire du mal", inverse: false, sensible: true },
];
