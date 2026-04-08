import { useState, useMemo } from "react";
import Header from "../components/ui/Header";
import { ALERTES_ALLAITEMENT, MYTHES_ALLAITEMENT } from "../data/allaitement";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", night: "#1E2A3A",
};

const CAT_COLORS = {
  allaitement: { bg: p.terracottaPale, color: p.terracotta, emoji: "🤱" },
  sommeil: { bg: "#D0D8EA", color: "#3A4A8A", emoji: "🌙" },
  pleurs: { bg: "#FAE0D8", color: "#A04030", emoji: "😢" },
  portage: { bg: p.saugePale, color: p.sauge, emoji: "🧣" },
  DME: { bg: "#D8EAF0", color: "#3A7A9A", emoji: "🥕" },
  "post-partum": { bg: "#E8D8F0", color: "#7A4A9A", emoji: "🌸" },
  "corps bébé": { bg: "#FDE8D8", color: "#B85C30", emoji: "👶" },
};

const FICHES = [
  // ALLAITEMENT
  ...Object.entries(ALERTES_ALLAITEMENT).map(([id, data]) => ({
    id, categorie: "allaitement", titre: data.titre, contenu: data.texte,
    conseils: data.conseils || [], lien: data.lien, lienLabel: data.lienLabel, urgence: data.urgence || false,
  })),
  ...MYTHES_ALLAITEMENT.map((m, i) => ({
    id: `mythe_${i}`, categorie: "allaitement",
    titre: `Mythe : "${m.mythe}"`, contenu: m.realite, conseils: [], lien: null, lienLabel: null, urgence: false,
  })),
  // SOMMEIL
  {
    id: "sommeil_cycles", categorie: "sommeil", titre: "Cycles de sommeil du nourrisson",
    contenu: "Les cycles de sommeil d'un nouveau-né durent 50-60 minutes (contre 90 min chez l'adulte). Entre deux cycles, il y a une phase de demi-éveil normale — ce n'est pas un réveil problématique. Laisser bébé se rendormir seul entre les cycles est une compétence qui se développe progressivement.",
    conseils: ["Attends quelques secondes avant d'intervenir à chaque bruit", "Un bébé qui geint entre deux cycles n'est pas forcément réveillé", "La nuit complète s'acquiert entre 3 et 6 mois en moyenne"],
    lien: null, lienLabel: null, urgence: false,
  },
  {
    id: "sommeil_cosleeping", categorie: "sommeil", titre: "Cododo — les 7 critères de sécurité",
    contenu: "Le cododo pratiqué en sécurité est une pratique physiologique et culturellement répandue dans le monde entier. Il favorise l'allaitement et le lien d'attachement. Les 7 critères SAFE doivent tous être respectés.",
    conseils: [
      "Pas de tabac (toi, ton partenaire, dans le logement)",
      "Pas d'alcool ni de médicaments sédatifs",
      "Pas d'obésité excessive",
      "Bébé né à terme et en bonne santé",
      "Sur un matelas ferme, pas de canapé ni fauteuil",
      "Sans couverture lourde sur bébé",
      "Bébé sur le dos ou sur le côté tourné vers toi",
    ],
    lien: null, lienLabel: null, urgence: false,
  },
  {
    id: "sommeil_ferber", categorie: "sommeil", titre: "Méthode Ferber — ce que dit la science",
    contenu: "La méthode Ferber (laisser pleurer) peut être efficace à court terme pour l'endormissement autonome, mais des études récentes montrent qu'elle n'est pas sans impact sur le stress de bébé. À moins de 6 mois, le système nerveux de bébé n'est pas mature pour gérer la détresse seul. D'autres approches respectueuses existent.",
    conseils: ["Avant 6 mois : répondre toujours aux pleurs est physiologiquement recommandé", "Routine d'endormissement régulière (bain, tétée, chanson) très efficace", "Le portage et la présence physique ne créent pas de mauvaises habitudes"],
    lien: null, lienLabel: null, urgence: false,
  },
  // PLEURS
  {
    id: "pleurs_5etrimestre", categorie: "pleurs", titre: "Le 5e trimestre",
    contenu: "Les 3 premiers mois de vie sont parfois appelés le '4e trimestre' ou '5e trimestre'. Bébé arrive dans un monde sensoriel intense après 9 mois de confort utérin. Le contact physique, le portage, la chaleur et le bruit blanc reproduisent l'environnement utérin et calment naturellement.",
    conseils: ["Portage peau contre peau le plus souvent possible", "Bruit blanc (aspirateur, machine à laver, bruit de pluie)", "Mouvement doux et régulier (marche, balancement)", "La période de pleurs intenses diminue généralement après 12 semaines"],
    lien: null, lienLabel: null, urgence: false,
  },
  {
    id: "pleurs_decryptage", categorie: "pleurs", titre: "Décrypter les pleurs",
    contenu: "Les pleurs sont le seul langage de bébé. Ils expriment un besoin — pas une manipulation. Répondre systématiquement aux pleurs dans les premiers mois construit la sécurité affective, pas une dépendance.",
    conseils: ["Faim : pleurs rythmiques, bébé porte les mains à la bouche", "Fatigue : pleurs grincheux, bébé se frotte les yeux", "Inconfort : pleurs aigus, bébé se raidit", "Besoin de contact : pleurs qui s'arrêtent immédiatement quand on le prend"],
    lien: null, lienLabel: null, urgence: false,
  },
  // PORTAGE
  {
    id: "portage_bases", categorie: "portage", titre: "Portage physiologique — les bases",
    contenu: "Le portage physiologique positionne bébé en M — hanches fléchies, genoux plus hauts que les fesses, dos arrondi en C. Cette position est celle naturellement adoptée par bébé quand on le prend dans les bras, et elle est optimale pour le développement des hanches.",
    conseils: ["Toujours voir le visage de bébé et vérifier qu'il respire librement", "Le menton ne doit pas être sur la poitrine", "Pas de portage ventral face au monde avant 6 mois (hanches et colonne)", "Consulte un professionnel certifié (IPBP) pour le premier nœud"],
    lien: null, lienLabel: null, urgence: false,
  },
  // DME
  {
    id: "dme_intro", categorie: "DME", titre: "Diversification menée par l'enfant (DME)",
    contenu: "La DME consiste à proposer à bébé des aliments en morceaux dès 6 mois révolus, en le laissant explorer seul. Elle développe l'autonomie, la motricité fine et une relation saine à la nourriture. Elle nécessite que bébé soit prêt.",
    conseils: ["Signes de prêt : tient assis sans aide, a perdu le réflexe d'extrusion, s'intéresse à la nourriture", "Toujours sous surveillance directe", "Différence étouffement (silencieux) vs haut-le-coeur (normal, bruyant)", "Pas d'aliments ronds entiers (raisins, cerises, noix)"],
    lien: null, lienLabel: null, urgence: false,
  },
  {
    id: "dme_allergenes", categorie: "DME", titre: "Introduction des allergènes",
    contenu: "Les recommandations actuelles préconisent d'introduire les allergènes majeurs dès le début de la diversification (vers 6 mois) et régulièrement, pour réduire le risque d'allergie. Ne pas retarder leur introduction.",
    conseils: ["Allergènes majeurs : arachides, œuf, lait, blé, soja, poisson, crustacés, fruits à coque", "Introduire un à la fois, attendre 2-3 jours entre chaque nouveau", "En cas de terrain atopique familial, consulte le pédiatre avant"],
    lien: null, lienLabel: null, urgence: false,
  },
  // POST-PARTUM
  {
    id: "pp_matrescence", categorie: "post-partum", titre: "La matrescence",
    contenu: "La matrescence désigne la transformation profonde — physique, hormonale, identitaire — que traverse une femme lorsqu'elle devient mère. Comme l'adolescence, c'est une période de bouleversement et de reconstruction. Ne pas se sentir instantanément comblée est normal.",
    conseils: ["L'instinct maternel ne naît pas toujours à la naissance — il se construit", "Le sentiment d'incompétence est universel et temporaire", "Chercher de l'aide n'est pas une faiblesse", "En parler à d'autres mamans peut aider à dédramatiser"],
    lien: null, lienLabel: null, urgence: false,
  },
  // CORPS BÉBÉ
  {
    id: "selles_couleurs", categorie: "corps bébé", titre: "Les selles du nouveau-né",
    contenu: "Les selles évoluent beaucoup dans les premiers jours et semaines. Le méconium (selles noires/vertes des premiers jours) est normal. Les selles d'un bébé allaité sont ensuite jaunes, molles et grumeleuses.",
    conseils: ["Jaune moutarde : normal chez le bébé allaité", "Vert mousse : normal si bébé est en bonne santé, peut indiquer un déséquilibre avant/arrière-lait", "Blanc/gris ou rouge sang : consulte rapidement", "Fréquence : de 10/jour à 1 tous les 10 jours — les deux peuvent être normaux"],
    lien: null, lienLabel: null, urgence: false,
  },
  {
    id: "ictere", categorie: "corps bébé", titre: "Jaunisse (ictère) du nouveau-né",
    contenu: "La jaunisse physiologique (jaunissement de la peau et du blanc des yeux) est très fréquente dans les premiers jours (50-60% des nourrissons). Elle est due à l'élimination de la bilirubine. Elle régresse généralement seule en 1-2 semaines.",
    conseils: ["Allaiter fréquemment aide l'élimination de la bilirubine", "Exposer bébé à la lumière du jour (pas soleil direct)", "Surveiller l'intensité — si très prononcée ou si bébé somnolent excessif : consulte"],
    lien: null, lienLabel: null, urgence: false,
  },
];

const CATEGORIES = Object.keys(CAT_COLORS);

function FicheCard({ fiche, onOpen }) {
  const cat = CAT_COLORS[fiche.categorie] || { bg: p.linDark, color: p.textLight, emoji: "📄" };
  return (
    <div onClick={() => onOpen(fiche)}
      style={{ background: p.white, borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${fiche.urgence ? "#F0A0A0" : p.linDark}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {cat.emoji}
      </div>
      <div style={{ flex: 1 }}>
        {fiche.urgence && <div style={{ fontSize: 10, fontWeight: 700, color: "#C04040", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>⚠ Consulte rapidement</div>}
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginBottom: 3 }}>{fiche.titre}</div>
        <div style={{ fontSize: 11, color: p.textLight, lineHeight: 1.4 }}>
          {fiche.contenu.substring(0, 80)}...
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: cat.bg, color: cat.color, marginTop: 6, display: "inline-block" }}>
          {fiche.categorie}
        </span>
      </div>
      <span style={{ color: p.textLight, fontSize: 16, flexShrink: 0 }}>›</span>
    </div>
  );
}

function FicheDetail({ fiche, onClose }) {
  const cat = CAT_COLORS[fiche.categorie] || { bg: p.linDark, color: p.textLight, emoji: "📄" };
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, height: "100vh", background: p.lin, zIndex: 200, overflowY: "auto", padding: "0 0 40px" }}>
      <div style={{ background: p.white, padding: "52px 20px 20px", borderBottom: `1px solid ${p.linDark}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button onClick={onClose} style={{ background: p.linDark, border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 16, cursor: "pointer", flexShrink: 0 }}>←</button>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: cat.bg, color: cat.color, display: "inline-block", marginBottom: 6 }}>
            {cat.emoji} {fiche.categorie}
          </span>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: p.text, lineHeight: 1.3 }}>{fiche.titre}</div>
        </div>
      </div>
      <div style={{ padding: "20px 20px" }}>
        {fiche.urgence && (
          <div style={{ background: "#FFF0F0", borderRadius: 12, padding: "12px 14px", border: "1.5px solid #F0A0A0", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C04040" }}>⚠ Consulte un professionnel rapidement</div>
          </div>
        )}
        <div style={{ fontSize: 14, color: p.text, lineHeight: 1.7, marginBottom: 16 }}>{fiche.contenu}</div>
        {fiche.conseils.length > 0 && (
          <div style={{ background: p.white, borderRadius: 14, padding: "14px 16px", border: `1px solid ${p.linDark}`, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.textLight, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>À retenir</div>
            {fiche.conseils.map((c, i) => (
              <div key={i} style={{ fontSize: 13, color: p.text, display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: p.sauge, flexShrink: 0 }}>·</span><span>{c}</span>
              </div>
            ))}
          </div>
        )}
        {fiche.lien && (
          <a href={fiche.lien} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 10, background: p.terracottaPale, borderRadius: 12, padding: "12px 14px", textDecoration: "none", marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>🔗</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: p.terracotta }}>{fiche.lienLabel}</span>
          </a>
        )}
        <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic", padding: "8px 0" }}>
          Ceci n'est pas un avis médical · Pour toute inquiétude, consulte un professionnel de santé
        </div>
      </div>
    </div>
  );
}

export default function Info() {
  const [recherche, setRecherche] = useState("");
  const [catActive, setCatActive] = useState(null);
  const [ficheOuverte, setFicheOuverte] = useState(null);

  const fichesFiltrees = useMemo(() => {
    return FICHES.filter(f => {
      const matchCat = !catActive || f.categorie === catActive;
      const matchSearch = !recherche || f.titre.toLowerCase().includes(recherche.toLowerCase()) || f.contenu.toLowerCase().includes(recherche.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [recherche, catActive]);

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: p.lin }}>
      {ficheOuverte && <FicheDetail fiche={ficheOuverte} onClose={() => setFicheOuverte(null)} />}
      <Header />
      <div style={{ padding: "18px 18px 110px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: p.text, marginBottom: 14 }}>
          📖 Bibliothèque
        </div>

        {/* Recherche */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input type="text" value={recherche} onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher : engorgement, cododo, DME..."
            style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 14, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
        </div>

        {/* Catégories */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
          <button onClick={() => setCatActive(null)}
            style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${!catActive ? p.terracotta : p.linDark}`, background: !catActive ? p.terracottaPale : "transparent", color: !catActive ? p.terracotta : p.textLight, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            Tout
          </button>
          {CATEGORIES.map(cat => {
            const c = CAT_COLORS[cat];
            const active = catActive === cat;
            return (
              <button key={cat} onClick={() => setCatActive(active ? null : cat)}
                style={{ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${active ? c.color : p.linDark}`, background: active ? c.bg : "transparent", color: active ? c.color : p.textLight, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                {c.emoji} {cat}
              </button>
            );
          })}
        </div>

        {/* Résultats */}
        <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, marginBottom: 10 }}>
          {fichesFiltrees.length} fiche{fichesFiltrees.length > 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fichesFiltrees.map(f => <FicheCard key={f.id} fiche={f} onOpen={setFicheOuverte} />)}
        </div>
        {fichesFiltrees.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: p.textLight }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 14 }}>Aucun résultat pour "{recherche}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
