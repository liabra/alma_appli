import { useState } from "react";
import Header from "../components/ui/Header";
import { RESSOURCES_SOUTIEN, EDINBURGH_QUESTIONS } from "../data/postpartum";
import { useSessionStore } from "../store/useSessionStore";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", night: "#1E2A3A",
};

const CORPS_SECTIONS = [
  {
    titre: "🌸 Récupération périnéale",
    contenu: "Le périnée a subi une pression importante pendant la grossesse et l'accouchement. La rééducation périnéale est remboursée par la Sécurité sociale (10 séances). Elle se fait avec une sage-femme ou kinésithérapeute spécialisée, idéalement entre 6 et 8 semaines après l'accouchement.",
    conseils: ["Ne reprends pas le sport avant l'aval de ta sage-femme ou kiné", "Évite les sauts, abdominaux et gainage pendant au moins 6-8 semaines", "Les fuites urinaires à l'effort ne sont pas normales — consulte"],
  },
  {
    titre: "✂️ Cicatrice césarienne ou épisiotomie",
    contenu: "La cicatrisation prend 6 à 8 semaines en surface, mais la guérison profonde peut prendre 6 mois à 1 an. Une rééducation cicatricielle (massage de la cicatrice) est recommandée dès que la plaie est fermée.",
    conseils: ["Nettoie la cicatrice à l'eau et au savon doux", "Hydrate avec de l'huile végétale (rose musquée, calendula) dès cicatrisation complète", "Signal d'alarme : rougeur, chaleur, écoulement — consulte"],
  },
  {
    titre: "🩸 Lochies (saignements post-partum)",
    contenu: "Les lochies sont normales jusqu'à 6 semaines. Elles passent du rouge vif les premiers jours au rosé puis au blanc/jaune. Une odeur forte, des caillots importants ou une reprise de saignements rouges vifs après amélioration doivent alerter.",
    conseils: ["Utilise des serviettes hygiéniques, pas de tampons", "Évite les bains (douches uniquement) les premières semaines", "Consulte si saignements abondants (plus d'une serviette par heure)"],
  },
  {
    titre: "💪 Reprise du sport",
    contenu: "Avant 6-8 semaines minimum, pas de sport. La visite post-natale et l'accord de ta sage-femme ou médecin sont indispensables. Commence par la marche, puis reprends progressivement.",
    conseils: ["Marche douce dès J5-J10", "Yoga prénatal doux après 6 semaines avec accord médical", "Course à pied, abdominaux, gainage : après bilan périnéal favorable uniquement"],
  },
];

const NUTRITION_SECTIONS = [
  {
    titre: "🥗 Besoins post-partum",
    contenu: "Le corps récupère d'un effort majeur. Les besoins caloriques augmentent de 500 kcal/jour si tu allaites. L'alimentation reste la même que pendant la grossesse : variée, équilibrée, non restrictive.",
    items: ["Protéines : viande, poisson, œufs, légumineuses", "Fer : viande rouge, lentilles, épinards + vitamine C pour l'absorption", "Calcium : produits laitiers, amandes, sardines", "Oméga 3 : poissons gras (sardines, maquereau, saumon)"],
  },
  {
    titre: "☀️ Vitamine D",
    contenu: "La supplémentation en vitamine D est recommandée pour toi ET bébé (si allaité). Parles-en à ton médecin.",
    items: ["Bébé allaité : 1000-1200 UI/jour de vitamine D3 jusqu'à 18 mois", "Maman allaitante : 1500-2000 UI/jour selon exposition solaire", "En hiver et sous latitude nord : supplémentation systématique"],
  },
  {
    titre: "⚡ Fatigue et fer",
    contenu: "Une carence en fer est fréquente après l'accouchement (pertes sanguines). Symptômes : fatigue intense, essoufflement, pâleur. Un bilan sanguin à 6-8 semaines peut être pertinent.",
    items: ["Demande un bilan ferritine à ta visite post-natale", "Alimentation riche en fer + vitamine C", "Supplémentation si nécessaire sur prescription"],
  },
];

function MoodBar({ checkins }) {
  const moodColors = ["#E57373", "#FFB74D", "#81C784", "#4CAF50", "#66BB6A"];
  const moodEmojis = ["😔", "😐", "🙂", "😊", "🌟"];
  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.linDark}` }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: p.text, marginBottom: 14 }}>
        📊 Ton moral cette semaine
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>
        {checkins.map((c, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 14 }}>{moodEmojis[c.mood]}</div>
            <div style={{ width: "100%", borderRadius: 6, background: moodColors[c.mood], height: `${(c.mood + 1) * 12}px`, transition: "height 0.3s" }} />
            <div style={{ fontSize: 9, color: p.textLight, fontWeight: 600 }}>{c.date}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: p.textLight, marginTop: 10, fontStyle: "italic" }}>
        Basé sur tes check-ins quotidiens · Ceci n'est pas un outil médical
      </div>
    </div>
  );
}

function Edinbourg() {
  const [reponses, setReponses] = useState({});
  const [score, setScore] = useState(null);
  const options = ["Jamais", "Rarement", "Parfois", "Souvent"];

  const calculer = () => {
    const total = Object.values(reponses).reduce((a, b) => a + b, 0);
    setScore(total);
  };

  const toutesRepondues = Object.keys(reponses).length === EDINBURGH_QUESTIONS.length;

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.terracottaPale}` }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: p.text, marginBottom: 6 }}>
        🌡 Questionnaire d'humeur
      </div>
      <div style={{ fontSize: 12, color: p.textLight, marginBottom: 14, lineHeight: 1.5 }}>
        Ces questions concernent les 7 derniers jours. Ce questionnaire est indicatif — il ne remplace pas l'avis d'un professionnel de santé.
      </div>
      {!score ? (
        <>
          {EDINBURGH_QUESTIONS.map((q) => (
            <div key={q.id} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: p.text, marginBottom: 8 }}>{q.id}. {q.texte}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {options.map((opt, i) => (
                  <button key={i} onClick={() => setReponses(r => ({ ...r, [q.id]: q.inverse ? 3 - i : i }))}
                    style={{ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${reponses[q.id] === (q.inverse ? 3 - i : i) ? p.terracotta : p.linDark}`, background: reponses[q.id] === (q.inverse ? 3 - i : i) ? p.terracottaPale : "transparent", fontSize: 12, fontWeight: 600, color: reponses[q.id] === (q.inverse ? 3 - i : i) ? p.terracotta : p.textLight, cursor: "pointer" }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={calculer} disabled={!toutesRepondues}
            style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: toutesRepondues ? p.terracotta : p.linDark, color: "#fff", fontSize: 13, fontWeight: 700, cursor: toutesRepondues ? "pointer" : "default" }}>
            Voir le résultat
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: score < 10 ? p.sauge : score < 13 ? p.terracottaL : "#C04040" }}>
            {score}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: p.text, marginBottom: 8 }}>
            {score < 10 ? "Tout semble aller 🌿" : score < 13 ? "Quelques difficultés" : "À partager avec un professionnel"}
          </div>
          <div style={{ fontSize: 13, color: p.textLight, lineHeight: 1.6, marginBottom: 16 }}>
            {score < 10
              ? "Ton score suggère que tu traverses cette période sans signe de dépression post-partum notable."
              : score < 13
              ? "Ton score indique quelques difficultés. N'hésite pas à en parler à ta sage-femme ou ton médecin lors de ta prochaine visite."
              : "Ton score mérite attention. Contacte ta sage-femme, ton médecin ou une association de soutien. Tu n'es pas seule."}
          </div>
          {score >= 10 && (
            <div style={{ background: p.terracottaPale, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
              {RESSOURCES_SOUTIEN.map((r, i) => (
                <div key={i} style={{ marginBottom: i < RESSOURCES_SOUTIEN.length - 1 ? 8 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.terracotta }}>{r.nom}</div>
                  {r.tel && <div style={{ fontSize: 12, color: p.text }}>📞 {r.tel}</div>}
                  {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: p.terracotta }}>{r.url}</a>}
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 10, color: p.textLight, fontStyle: "italic" }}>
            Ce questionnaire est inspiré de l'échelle d'Édimbourg · Il ne constitue pas un diagnostic médical
          </div>
          <button onClick={() => { setScore(null); setReponses({}); }}
            style={{ marginTop: 12, padding: "8px 20px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: "transparent", fontSize: 12, fontWeight: 600, color: p.textLight, cursor: "pointer" }}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}

function OngletCorps() {
  const [ouvert, setOuvert] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {CORPS_SECTIONS.map((s) => (
        <div key={s.titre} onClick={() => setOuvert(ouvert === s.titre ? null : s.titre)}
          style={{ background: p.white, borderRadius: 16, border: `1.5px solid ${p.linDark}`, overflow: "hidden", cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>{s.titre}</div>
            <span style={{ color: p.textLight }}>{ouvert === s.titre ? "▲" : "▼"}</span>
          </div>
          {ouvert === s.titre && (
            <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${p.linDark}` }}>
              <div style={{ fontSize: 13, color: p.text, lineHeight: 1.6, marginTop: 10, marginBottom: 10 }}>{s.contenu}</div>
              {s.conseils.map((c, i) => (
                <div key={i} style={{ fontSize: 12, color: p.textLight, display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: p.sauge }}>·</span><span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic" }}>
        Ceci n'est pas un avis médical · Consulte toujours un professionnel de santé
      </div>
    </div>
  );
}

function OngletMental() {
  const { getCheckinsDerniersDays } = useSessionStore();
  const checkinsAffichage = getCheckinsDerniersDays(7);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <MoodBar checkins={checkinsAffichage} />
      <Edinbourg />
      <div style={{ background: `linear-gradient(135deg, #2C3E2D, #1A2E1B)`, borderRadius: 20, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: p.saugePale, marginBottom: 10 }}>💬 Ressources de soutien</div>
        {RESSOURCES_SOUTIEN.map((r, i) => (
          <div key={i} style={{ marginBottom: 10, padding: "10px 12px", background: "rgba(255,255,255,0.07)", borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{r.nom}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{r.description}</div>
            {r.tel && <div style={{ fontSize: 13, fontWeight: 700, color: p.saugePale, marginTop: 4 }}>📞 {r.tel} {r.disponible && `· ${r.disponible}`}</div>}
            {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: p.saugePale, marginTop: 2, display: "block" }}>{r.url}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

function OngletNutrition() {
  const [ouvert, setOuvert] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {NUTRITION_SECTIONS.map((s) => (
        <div key={s.titre} onClick={() => setOuvert(ouvert === s.titre ? null : s.titre)}
          style={{ background: p.white, borderRadius: 16, border: `1.5px solid ${p.linDark}`, overflow: "hidden", cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>{s.titre}</div>
            <span style={{ color: p.textLight }}>{ouvert === s.titre ? "▲" : "▼"}</span>
          </div>
          {ouvert === s.titre && (
            <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${p.linDark}` }}>
              <div style={{ fontSize: 13, color: p.text, lineHeight: 1.6, marginTop: 10, marginBottom: 8 }}>{s.contenu}</div>
              {s.items.map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: p.textLight, display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: p.sauge }}>·</span><span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic" }}>
        Ceci n'est pas un avis médical · Pour toute question nutritionnelle, consulte un professionnel
      </div>
    </div>
  );
}

export default function Moi() {
  const [onglet, setOnglet] = useState("corps");
  const onglets = [
    { id: "corps", label: "🌸 Corps" },
    { id: "mental", label: "🧠 Mental" },
    { id: "nutrition", label: "🥗 Nutrition" },
  ];

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: p.lin }}>
      <Header />
      <div style={{ padding: "18px 18px 110px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: p.text, marginBottom: 16 }}>
          🌸 Prendre soin de moi
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, background: p.linDark, borderRadius: 14, padding: 4 }}>
          {onglets.map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              style={{ flex: 1, padding: "9px 4px", borderRadius: 11, border: "none", background: onglet === o.id ? p.white : "transparent", color: onglet === o.id ? p.terracotta : p.textLight, fontSize: 11, fontWeight: 700, cursor: "pointer", boxShadow: onglet === o.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {o.label}
            </button>
          ))}
        </div>
        {onglet === "corps" && <OngletCorps />}
        {onglet === "mental" && <OngletMental />}
        {onglet === "nutrition" && <OngletNutrition />}
      </div>
    </div>
  );
}
