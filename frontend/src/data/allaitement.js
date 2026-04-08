// Données statiques allaitement — contenu Alma
// Sources : physiologie lactation, recommandations OMS, références LLL France

export const SIGNAUX_ALLAITEMENT = [
  { id: "douleur", label: "😣 Douleur" },
  { id: "lache", label: "👄 Lâche le sein" },
  { id: "court", label: "⏱ Tétée courte" },
  { id: "agite", label: "😤 Agité·e" },
  { id: "crevasse", label: "🩹 Crevasses" },
  { id: "engorgement", label: "🔴 Engorgement" },
  { id: "mastite", label: "🔥 Sein très chaud" },
  { id: "greve", label: "🚫 Grève du sein" },
];

export const ALERTES_ALLAITEMENT = {
  douleur: {
    titre: "Douleur pendant la tétée",
    texte: "La douleur n'est pas normale — elle indique souvent une mauvaise prise. Vérifie que la bouche de bébé englobe bien toute l'aréole, pas seulement le mamelon. Le menton de bébé doit toucher le sein, la lèvre inférieure retroussée vers l'extérieur.",
    conseils: ["Repositionne bébé en glissant un doigt propre dans le coin de sa bouche", "Essaie la position biological nurturing (semi-allongée)", "Vérifie l'absence de frein de langue"],
    lien: "https://www.lllfrance.org/vous-informer/votre-allaitement/demarrage/1757-la-prise-du-sein",
    lienLabel: "Guide LLL : bonne prise du sein →",
    urgence: false,
  },
  lache: {
    titre: "Bébé lâche le sein",
    texte: "Un flux trop rapide peut surprendre bébé et le faire lâcher. La position semi-allongée (biological nurturing) ralentit naturellement le débit. Un réflexe d'éjection fort est fréquent en début de tétée.",
    conseils: ["Position allongée sur le côté ou semi-allongée", "Exprimer un peu de lait avant la mise au sein", "Laisser bébé faire des pauses naturelles"],
    lien: "https://www.lllfrance.org/vous-informer/votre-allaitement/problemes/1802-refluxe-d-ejection-fort",
    lienLabel: "Guide LLL : réflexe d'éjection fort →",
    urgence: false,
  },
  court: {
    titre: "Tétées très courtes",
    texte: "À moins de 3 semaines, une tétée efficace dure généralement 10–20 min. Moins de 5 min répétées peut signifier une prise insuffisante ou un bébé somnolent qui ne transfère pas assez de lait.",
    conseils: ["Stimule bébé en chatouillant la plante des pieds ou la joue", "Déshabille bébé pour le contact peau à peau", "Change de sein si bébé ralentit plutôt que de s'endormir"],
    lien: "https://www.lllfrance.org",
    lienLabel: "Contacter une animatrice LLL →",
    urgence: false,
  },
  agite: {
    titre: "Bébé agité au sein",
    texte: "L'agitation est très fréquente lors des pics de croissance (J10, 3 semaines, 6 semaines). Le flux peut sembler insuffisant temporairement — c'est bébé qui commande une augmentation de production. C'est passager (48–72h).",
    conseils: ["Tète aussi souvent que bébé le demande ces 2–3 jours", "Ne donne pas de complément sauf avis médical — cela freinerait la stimulation", "Repose-toi au maximum pendant cette période"],
    lien: "https://www.lllfrance.org/vous-informer/votre-allaitement/physiologie/1778-les-poussees-de-croissance",
    lienLabel: "Guide LLL : pics de croissance →",
    urgence: false,
  },
  crevasse: {
    titre: "Crevasses",
    texte: "Les crevasses viennent presque toujours d'une mauvaise prise du sein. Corriger la position est la solution principale — les crèmes et remèdes sont secondaires.",
    conseils: ["Corriger la prise en priorité — c'est la cause principale", "Appliquer du lait maternel après la tétée, laisser sécher à l'air", "Lanoline pure si nécessaire, pas besoin de rincer", "Ne pas utiliser de bouts de sein en silicone sans avis d'une IBCLC"],
    lien: "https://www.lllfrance.org/vous-informer/votre-allaitement/problemes/1762-les-crevasses",
    lienLabel: "Guide LLL : crevasses →",
    urgence: false,
  },
  engorgement: {
    titre: "Engorgement",
    texte: "Seins très tendus, chauds, douloureux ? C'est l'engorgement — fréquent à la montée de lait (J2-J5) et lors de tétées espacées. La clé : vider régulièrement sans hyperstimuler.",
    conseils: ["Tète très fréquemment (8–12 fois/24h minimum)", "Massage doux en direction du mamelon sous la douche tiède (pas chaude)", "Compresses froides entre les tétées pour soulager", "Ne pas vider complètement au tire-lait — stimule davantage la production"],
    lien: "https://www.lllfrance.org/vous-informer/votre-allaitement/problemes/1763-l-engorgement",
    lienLabel: "Guide LLL : engorgement →",
    urgence: false,
  },
  mastite: {
    titre: "Mastite possible — consulte rapidement",
    texte: "Sein très chaud, rouge, douloureux avec fièvre (>38,5°) ? C'est peut-être une mastite. Continue d'allaiter côté atteint — c'est important. Consulte un médecin dans les 24h.",
    conseils: ["Continue d'allaiter ou de tirer le lait côté atteint — vital", "Repos absolu", "Consulte ton médecin dans les 24h (antibiotiques souvent nécessaires)", "Compresses chaudes avant la tétée pour faciliter l'écoulement"],
    lien: "https://www.lllfrance.org/vous-informer/votre-allaitement/problemes/1764-la-mastite",
    lienLabel: "Guide LLL : mastite →",
    urgence: true,
  },
  greve: {
    titre: "Grève du sein",
    texte: "Bébé refuse soudainement le sein alors que tout allait bien ? C'est une grève du sein — souvent temporaire (quelques jours). Elle ne signifie pas que bébé veut sevrer.",
    conseils: ["Propose le sein quand bébé est somnolent ou à moitié endormi", "Allaite en marchant ou en berçant — le mouvement aide", "Peau contre peau maximum pour réassurer bébé", "Tire ton lait pour maintenir la production pendant ce temps"],
    lien: "https://www.lllfrance.org/vous-informer/votre-allaitement/problemes/1808-la-greve-du-sein",
    lienLabel: "Guide LLL : grève du sein →",
    urgence: false,
  },
};

// Mythes vs réalité allaitement
export const MYTHES_ALLAITEMENT = [
  {
    mythe: "Je n'ai pas assez de lait",
    realite: "95% des mamans produisent assez de lait. La production s'adapte à la demande. Si bébé a au moins 6 couches mouillées/jour et reprend son poids de naissance avant J15, tout va bien.",
  },
  {
    mythe: "Il faut attendre 3h entre les tétées",
    realite: "Non. À la naissance, un nouveau-né tète 8 à 12 fois par 24h, parfois plus. Tète à la demande — c'est ce qui régule la production et assure une bonne prise de poids.",
  },
  {
    mythe: "Allaiter fait tomber les seins",
    realite: "La grossesse elle-même modifie les seins. L'allaitement n'aggrave pas cela — c'est la génétique, l'âge et les grossesses qui jouent.",
  },
  {
    mythe: "Si le bébé tète tout le temps c'est qu'il n'est pas assez nourri",
    realite: "Le cluster feeding (tétées très rapprochées) est physiologique, surtout en soirée. C'est une phase de stimulation intense, pas un signe d'insuffisance de lait.",
  },
];
