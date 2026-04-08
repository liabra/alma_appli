// Signaux d'alerte — quand consulter un médecin
// Source : recommandations HAS, Ameli.fr, SFP (Société Française de Pédiatrie)
// Ce guide dit QUAND consulter, jamais QUOI diagnostiquer

export const DISCLAIMER = "Ce guide est basé sur les recommandations officielles de la HAS et de la Société Française de Pédiatrie. Il indique quand consulter — il ne diagnostique rien. En cas de doute, consulte toujours un professionnel de santé.";

export const SIGNAUX_URGENCE = {
  titre: "🚨 Urgences — appelle le 15 ou le 18 immédiatement",
  couleur: "#C04040",
  fond: "#FFF0F0",
  bordure: "#F0A0A0",
  signaux: [
    "Bébé de moins de 3 mois avec fièvre ≥ 38°",
    "Bébé ne répond plus, difficile à réveiller",
    "Difficultés respiratoires sévères (respiration rapide, creusement entre les côtes)",
    "Convulsions ou tremblements incontrôlables",
    "Fontanelle bombée (bombement sur le dessus du crâne)",
    "Peau marbrée, grisâtre ou bleutée",
    "Saignement abondant inexpliqué",
    "Perte de conscience",
    "Chute avec traumatisme crânien + somnolence",
  ]
};

export const SIGNAUX_MEDECIN_JOUR = {
  titre: "⚠️ Médecin le jour même",
  couleur: "#C07020",
  fond: "#FFFBF0",
  bordure: "#F0D080",
  signaux: [
    "Fièvre ≥ 38,5° chez bébé de 3 à 6 mois",
    "Fièvre ≥ 39° chez bébé de plus de 6 mois",
    "Fièvre ≥ 40° quel que soit l'âge",
    "Bébé refuse de manger ou de boire depuis plus de 8h",
    "Vomissements en jet répétés",
    "Diarrhée importante avec signes de déshydratation (pleurs sans larmes, bouche sèche, fontanelle creuse)",
    "Pleurs intenses inconsolables depuis plus de 3h",
    "Rougeur ou gonflement autour du nombril",
    "Douleur à la palpation du ventre",
    "Éruption cutanée soudaine avec fièvre",
    "Yeux très rouges avec sécrétions importantes (conjonctivite)",
  ]
};

export const SIGNAUX_CONSULTATION = {
  titre: "📋 Consultation prochaine (dans les 24-48h)",
  couleur: "#6B8F71",
  fond: "#F0F8F0",
  bordure: "#C8DBC9",
  signaux: [
    "Fièvre modérée (38-39°) chez bébé de plus de 6 mois, bonne forme générale",
    "Toux persistante depuis plus de 5 jours",
    "Nez bouché persistant empêchant de téter ou de dormir",
    "Oreille tiraillée, pleurs accrus la nuit (otite possible)",
    "Prise de poids insuffisante (moins de 150g/semaine avant 3 mois)",
    "Régurgitations abondantes avec perte de poids",
    "Selles blanches ou grises (à tout âge — urgent si persistant)",
    "Selles avec sang (consulte rapidement)",
    "Bébé qui ne suit pas des yeux à 2 mois",
    "Pas de sourire social à 3 mois",
  ]
};

// Tableau fièvre selon l'âge — résumé visuel
export const TABLEAU_FIEVRE = [
  { age: "< 3 mois", seuil: "≥ 38°", action: "Urgences", urgence: true },
  { age: "3 à 6 mois", seuil: "≥ 38,5°", action: "Médecin le jour même", urgence: true },
  { age: "> 6 mois", seuil: "≥ 39°", action: "Médecin le jour même", urgence: true },
  { age: "Tout âge", seuil: "≥ 40°", action: "Médecin le jour même", urgence: true },
  { age: "Tout âge", seuil: "38-39° (bon état général)", action: "Surveille, antipyrétique si inconfort", urgence: false },
];

// Ressources professionnelles
export const RESSOURCES_PRO = [
  {
    id: "ibclc",
    titre: "Consultante en lactation IBCLC",
    description: "Professionnelle certifiée en allaitement. Indispensable pour les difficultés d'allaitement, douleurs, prise de poids insuffisante.",
    recherche: "consultante lactation IBCLC",
    lienAnnuaire: "https://www.consultante-en-lactation.fr/trouver-une-ibclc/",
    emoji: "🤱",
  },
  {
    id: "lll",
    titre: "Animatrice La Leche League",
    description: "Soutien bénévole de mère à mère pour l'allaitement. Gratuit, disponible par téléphone et en réunion.",
    recherche: "La Leche League animatrice",
    lienAnnuaire: "https://www.lllfrance.org/vous-aider/trouver-un-groupe",
    emoji: "🌸",
  },
  {
    id: "sf",
    titre: "Sage-femme libérale",
    description: "Suivi post-natal, rééducation périnéale, allaitement, soutien post-partum. Remboursé SS.",
    recherche: "sage-femme libérale",
    lienAnnuaire: "https://www.ordre-sages-femmes.fr/annuaire/",
    emoji: "👩‍⚕️",
  },
  {
    id: "osteo",
    titre: "Ostéopathe pédiatrique",
    description: "Pour coliques, plagiocéphalie, difficultés de tétée liées aux tensions. Demande un praticien spécialisé nourrisson.",
    recherche: "ostéopathe pédiatrique nourrisson",
    lienAnnuaire: null,
    emoji: "🙌",
  },
  {
    id: "pmi",
    titre: "PMI (Protection Maternelle et Infantile)",
    description: "Consultations gratuites de puéricultrice et médecin. Pesée, conseils allaitement, soutien post-partum.",
    recherche: "PMI Protection Maternelle Infantile",
    lienAnnuaire: "https://www.service-public.fr/particuliers/vosdroits/F2867",
    emoji: "🏥",
  },
  {
    id: "pediatre",
    titre: "Pédiatre",
    description: "Suivi de santé, vaccins, courbes de croissance. Penser à en choisir un avant la naissance.",
    recherche: "pédiatre",
    lienAnnuaire: "https://www.doctolib.fr/pediatre",
    emoji: "👨‍⚕️",
  },
];
