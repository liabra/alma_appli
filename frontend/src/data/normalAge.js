// Questions fréquentes selon l'âge exact de bébé
// Filtrées dynamiquement selon getAgeDays()

export const NORMAL_AGE = [
  // 0-14 jours
  {
    minDays: 0, maxDays: 14,
    questions: [
      { q: "Il tète très souvent (toutes les heures)", r: "Complètement normal. À la naissance, l'estomac de bébé fait la taille d'une bille. 8 à 12 tétées par 24h est la norme physiologique." },
      { q: "Il a perdu du poids depuis la naissance", r: "Normal jusqu'à 10% du poids de naissance. Il doit regagner son poids natal avant J15." },
      { q: "Ses selles sont noires/vertes (méconium)", r: "Complètement normal les 2-3 premiers jours. Elles vont virer au jaune moutarde avec l'allaitement." },
      { q: "Il dort énormément (16-20h/jour)", r: "Normal. Les nouveau-nés ont besoin de beaucoup de sommeil. Réveil actif pour les tétées si nécessaire." },
      { q: "Il a la jaunisse (peau jaune)", r: "L'ictère physiologique touche 50-60% des nouveau-nés. Il régresse généralement seul en 1-2 semaines. Tète souvent pour aider." },
      { q: "Il grogne et se tortille dans son sommeil", r: "Normal. Le sommeil du nouveau-né est très actif — bruits, sourires, sursauts. Ce n'est pas un réveil." },
    ]
  },
  // 2-6 semaines
  {
    minDays: 14, maxDays: 42,
    questions: [
      { q: "Il a des périodes de pleurs inconsolables le soir", r: "Le 'pic de pleurs' culminme vers 6 semaines. C'est physiologique — le système nerveux est immature. Ça passe vers 3 mois." },
      { q: "Il veut téter tout le temps certains jours (cluster feeding)", r: "Normal. Le cluster feeding (tétées regroupées) stimule la production de lait. C'est bébé qui commande une augmentation." },
      { q: "Il fait ses nuits de 17h à 2h du matin", r: "Normal. Les bébés allaités ont des cycles différents. Son 'nuit' biologique n'est pas le tien encore." },
      { q: "Il a des petits boutons sur le visage", r: "Acné néonatale — très fréquente vers 3-4 semaines. Lié aux hormones maternelles. Disparaît seul." },
      { q: "Il sursaute au moindre bruit", r: "Réflexe de Moro — normal jusqu'à 4-6 mois. Le système nerveux mature progressivement." },
    ]
  },
  // 6 semaines - 3 mois
  {
    minDays: 42, maxDays: 90,
    questions: [
      { q: "Il ne fait plus ses selles tous les jours", r: "Normal pour un bébé allaité après 6 semaines. Le lait maternel est si bien absorbé qu'il peut y avoir 1 selle tous les 7-10 jours." },
      { q: "Il refuse le biberon alors qu'il prenait les deux", r: "Confusion sein-tétine fréquente. Essaie différentes tétines ou donne le biberon par quelqu'un d'autre que toi." },
      { q: "Il sourit mais pas toujours quand je lui souris", r: "Normal. Le sourire social se consolide progressivement. Il apprend encore à contrôler ses expressions." },
      { q: "Il est agité au sein le soir", r: "Fréquent en soirée — le lait est moins riche à cette heure. Le cluster feeding du soir est normal et temporaire." },
      { q: "Il veut être porté en permanence", r: "Besoin développemental normal. Le portage réduit les pleurs de 43% selon les études. Ce n'est pas une mauvaise habitude." },
    ]
  },
  // 3-6 mois
  {
    minDays: 90, maxDays: 180,
    questions: [
      { q: "Il se réveille plus la nuit alors qu'il faisait ses nuits", r: "Régression du sommeil à 4 mois — liée à une maturation neurologique. Dure 2-6 semaines. Complètement normale." },
      { q: "Il met tout à la bouche", r: "Normal et nécessaire. La bouche est son principal outil de découverte sensorielle. Vérifier juste la sécurité des objets." },
      { q: "Il bave énormément", r: "Les glandes salivaires se développent vers 3-4 mois. Ça peut précéder les dents de plusieurs mois." },
      { q: "Il refuse de rester allongé", r: "Normal — il veut voir, interagir. Tapis d'éveil, portage, position assise soutenue quelques minutes." },
      { q: "Il rit aux éclats avec certains et pleure avec d'autres", r: "Début de la permanence de l'objet et de l'anxiété de séparation. Développementalement normal." },
    ]
  },
  // 6-12 mois
  {
    minDays: 180, maxDays: 365,
    questions: [
      { q: "Il se réveille la nuit depuis qu'il mange des solides", r: "Fréquent. La diversification perturbe parfois le sommeil temporairement. Maintenir le rythme de tétées/biberons." },
      { q: "Il fait des caprices quand je lui dis non", r: "Normal dès 8-9 mois. Il teste les limites et développe son autonomie. C'est un signe de développement sain." },
      { q: "Il ne marche pas encore à 11 mois", r: "Complètement normal. La marche peut apparaître entre 9 et 18 mois. La fourchette est très large." },
      { q: "Il dit 'mama' et 'papa' mais pas d'autres mots", r: "Normal. Le vocabulaire actif se développe entre 9 et 15 mois. La compréhension est souvent bien en avance sur la production." },
      { q: "Il mâche mais recrache les morceaux", r: "Normal en DME ou mixte. La compétence de mastiquer-avaler les morceaux se développe progressivement jusqu'à 18 mois." },
    ]
  },
  // 12-24 mois
  {
    minDays: 365, maxDays: 730,
    questions: [
      { q: "Il fait des crises de colère impressionnantes", r: "Les crises de 18-24 mois sont développementalement normales — il ressent des émotions intenses qu'il ne sait pas encore réguler. Ta présence calme est la meilleure réponse." },
      { q: "Il ne parle pas encore à 18 mois", r: "Le seuil d'alerte est 5 mots à 18 mois ou 20 mots à 24 mois. Si en dessous, une consultation peut être utile." },
      { q: "Il refuse de manger ce qu'il adorait la semaine dernière", r: "Néophobie alimentaire normale vers 18 mois-2 ans. Continuer à proposer sans forcer, il reviendra aux aliments." },
      { q: "Il veut encore le sein / biberon", r: "L'OMS recommande l'allaitement jusqu'à 2 ans et au-delà. Le biberon peut durer jusqu'à 2 ans sans problème dentaire si contenu approprié." },
      { q: "Il mord", r: "Comportement fréquent entre 12 et 24 mois — manque de langage pour exprimer frustration ou excitation. Réaction ferme et calme sans drama." },
    ]
  },
];

export function getNormalAgeData(ageDays) {
  return NORMAL_AGE.find(n => ageDays >= n.minDays && ageDays < n.maxDays) || NORMAL_AGE[NORMAL_AGE.length - 1];
}
