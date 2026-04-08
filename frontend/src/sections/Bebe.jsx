import { useState } from "react";
import { useBebeStore } from "../store/useBebeStore";
import { useSessionStore } from "../store/useSessionStore";
import Header from "../components/ui/Header";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", night: "#1E2A3A",
};

const VACCINS = [
  { age: "2 mois", vaccins: ["DTCaP-Hib-HepB (Hexavalent)", "Pneumocoque 13v", "Rotavirus"] },
  { age: "4 mois", vaccins: ["DTCaP-Hib-HepB (Hexavalent)", "Pneumocoque 13v", "Rotavirus"] },
  { age: "5 mois", vaccins: ["Méningocoque B"] },
  { age: "11 mois", vaccins: ["DTCaP-Hib-HepB (Hexavalent)", "Pneumocoque 13v", "Méningocoque B"] },
  { age: "12 mois", vaccins: ["ROR (Rougeole-Oreillons-Rubéole)", "Méningocoque C"] },
  { age: "16-18 mois", vaccins: ["ROR (2e dose)", "DTCaP-Hib (rappel)"] },
];

const DEVELOPPEMENT = [
  {
    tranche: "0-1 mois",
    titre: "Le nouveau-né",
    items: [
      "Réflexes archaïques normaux : succion, agrippement, Moro",
      "Vision floue à 20-30 cm — ton visage est sa première image",
      "Reconnaît ta voix dès la naissance",
      "Dort 16-20h par jour en cycles courts (50-60 min)",
      "Tète 8-12 fois par 24h — c'est physiologique, pas excessif",
    ],
    nota: "Le trotteur et le youpala sont déconseillés — ils perturbent l'acquisition de la marche et peuvent causer des accidents.",
  },
  {
    tranche: "1-3 mois",
    titre: "L'éveil social",
    items: [
      "Premier sourire social vers 6 semaines",
      "Suit les objets du regard",
      "Vocalises, gazouillis — parle-lui !",
      "Tenue de tête progressive en position ventrale",
      "Tapis d'éveil sur le ventre chaque jour (quelques minutes)",
    ],
    nota: "Temps d'éveil maximum : 45-60 min à 1 mois, 60-90 min à 2-3 mois. Au-delà = surmenage.",
  },
  {
    tranche: "3-6 mois",
    titre: "La motricité libre",
    items: [
      "Tenue de tête acquise",
      "Attrape les objets volontairement",
      "Se retourne ventre-dos puis dos-ventre",
      "Rit aux éclats",
      "Motricité libre au sol — pas de transat prolongé ni d'assiste-assis avant qu'il ne s'assoie seul",
    ],
    nota: "La diversification alimentaire se fait vers 6 mois révolus (signes de prêt : tient assis seul, a perdu le réflexe d'extrusion, s'intéresse à la nourriture).",
  },
  {
    tranche: "6-12 mois",
    titre: "L'exploration",
    items: [
      "S'assoit seul vers 6-8 mois",
      "Rampe, se traîne, se met à 4 pattes",
      "Pince pouce-index vers 9 mois",
      "Premiers mots vers 9-12 mois (mama, papa)",
      "Marche entre 9 et 18 mois — grande variabilité normale",
    ],
    nota: "Un bébé qui ne marche pas à 12 mois n'est pas en retard — la fourchette normale va jusqu'à 18 mois.",
  },
  {
    tranche: "12-18 mois",
    titre: "La marche et les premiers mots",
    items: [
      "Marche seul entre 9 et 18 mois — grande variabilité normale",
      "Vocabulaire de 5 à 20 mots vers 18 mois",
      "Imite les gestes et les actions des adultes",
      "Mange seul avec les doigts, puis à la cuillère",
      "Jeu en parallèle (à côté des autres enfants, pas encore avec eux)",
    ],
    nota: "Un bébé qui ne marche pas encore à 15 mois mérite une consultation, mais la fourchette normale va bien jusqu'à 18 mois.",
  },
  {
    tranche: "18-24 mois",
    titre: "L'autonomie et le langage",
    items: [
      "Court, monte les escaliers avec aide",
      "Vocabulaire de 20 à 50 mots, commence à associer 2 mots",
      "Comprend des consignes simples",
      "Jeu symbolique (faire semblant) — signe d'intelligence sociale",
      "Crise d'opposition normale — c'est la construction de l'identité",
    ],
    nota: "L'opposition et les colères à cet âge sont développementalement normales. C'est le signe que bébé construit son autonomie.",
  },
];

function OngletCroissance({ bebe }) {
  const [mesures, setMesures] = useState([
    { date: bebe?.dateNaissance || "", poids: "", taille: "", pc: "" }
  ]);
  const [nouvelle, setNouvelle] = useState({ date: "", poids: "", taille: "", pc: "" });

  const ajouter = () => {
    if (!nouvelle.date) return;
    setMesures(prev => [...prev, nouvelle]);
    setNouvelle({ date: "", poids: "", taille: "", pc: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Formulaire nouvelle mesure */}
      <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.terracottaPale}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: p.text, marginBottom: 14 }}>
          ➕ Nouvelle mesure
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[
            ["date", "📅 Date", "date"],
            ["poids", "⚖️ Poids (kg)", "number"],
            ["taille", "📏 Taille (cm)", "number"],
            ["pc", "🔵 Périm. crânien (cm)", "number"],
          ].map(([key, label, type]) => (
            <div key={key}>
              <div style={{ fontSize: 10, color: p.textLight, fontWeight: 600, marginBottom: 3 }}>{label}</div>
              <input type={type} value={nouvelle[key]} onChange={e => setNouvelle(n => ({ ...n, [key]: e.target.value }))}
                step={key === "poids" ? "0.01" : "0.1"}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: p.lin, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          ))}
        </div>
        <button onClick={ajouter} style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "none", background: p.terracotta, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Enregistrer
        </button>
      </div>

      {/* Historique */}
      {mesures.filter(m => m.date).length > 0 && (
        <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.linDark}` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: p.text, marginBottom: 12 }}>
            📈 Historique
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${p.linDark}` }}>
                  {["Date", "Poids", "Taille", "PC"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: p.textLight, fontWeight: 700, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mesures.filter(m => m.date).map((m, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${p.linDark}` }}>
                    <td style={{ padding: "8px", color: p.text }}>{m.date}</td>
                    <td style={{ padding: "8px", color: p.text, fontWeight: 600 }}>{m.poids ? `${m.poids} kg` : "—"}</td>
                    <td style={{ padding: "8px", color: p.text }}>{m.taille ? `${m.taille} cm` : "—"}</td>
                    <td style={{ padding: "8px", color: p.text }}>{m.pc ? `${m.pc} cm` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10, color: p.textLight, marginTop: 8, fontStyle: "italic" }}>
            Ces données sont stockées localement sur ton appareil · Ceci n'est pas un carnet médical officiel
          </div>
        </div>
      )}
    </div>
  );
}

function OngletVaccins({ bebe }) {
  const [faits, setFaits] = useState([]);
  const toggleFait = (age) => setFaits(prev => prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: `linear-gradient(135deg, ${p.sauge}, #4A7A50)`, borderRadius: 16, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
          📋 Calendrier vaccinal français 2024. Coche au fur et à mesure avec ton carnet de santé officiel.
        </div>
      </div>
      {VACCINS.map((v) => (
        <div key={v.age} onClick={() => toggleFait(v.age)}
          style={{ background: p.white, borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${faits.includes(v.age) ? p.sauge : p.linDark}`, cursor: "pointer", opacity: faits.includes(v.age) ? 0.7 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>🗓 {v.age}</div>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${faits.includes(v.age) ? p.sauge : p.linDark}`, background: faits.includes(v.age) ? p.sauge : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>
              {faits.includes(v.age) ? "✓" : ""}
            </div>
          </div>
          {v.vaccins.map((vac, i) => (
            <div key={i} style={{ fontSize: 12, color: p.textLight, marginBottom: 2 }}>· {vac}</div>
          ))}
        </div>
      ))}
      <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic", padding: "8px 0" }}>
        Ceci n'est pas un avis médical · Référence : calendrier vaccinal du Ministère de la Santé
      </div>
    </div>
  );
}

function OngletDeveloppement({ bebe }) {
  const [ouvert, setOuvert] = useState(null);
  const ageDays = bebe ? Math.floor((Date.now() - new Date(bebe.dateNaissance).getTime()) / 86400000) : 0;

  const trancheActive = (tranche) => {
    // Format "X-Y mois" ou "X mois"
    const parts = tranche.replace(" mois", "").split("-");
    const min = parseInt(parts[0]) * 30;
    const max = parts[1] ? parseInt(parts[1]) * 30 : 999;
    return ageDays >= min && ageDays <= max;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: p.terracottaPale, borderRadius: 14, padding: "12px 14px", border: `1px solid ${p.terracottaPale}` }}>
        <div style={{ fontSize: 12, color: p.terracotta, fontWeight: 600, lineHeight: 1.5 }}>
          🌱 Développement basé sur la motricité libre — chaque bébé a son propre rythme. Ces étapes sont des repères, pas des obligations.
        </div>
      </div>
      {DEVELOPPEMENT.map((d) => {
        const actif = trancheActive(d.tranche);
        const est_ouvert = ouvert === d.tranche;
        return (
          <div key={d.tranche} onClick={() => setOuvert(est_ouvert ? null : d.tranche)}
            style={{ background: p.white, borderRadius: 16, border: `1.5px solid ${actif ? p.terracotta : p.linDark}`, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
              <div>
                {actif && <div style={{ fontSize: 10, fontWeight: 700, color: p.terracotta, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>✦ Période actuelle</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>{d.tranche} · {d.titre}</div>
              </div>
              <span style={{ color: p.textLight, fontSize: 16 }}>{est_ouvert ? "▲" : "▼"}</span>
            </div>
            {est_ouvert && (
              <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${p.linDark}` }}>
                <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {d.items.map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: p.text, display: "flex", gap: 8 }}>
                      <span style={{ color: p.sauge, flexShrink: 0 }}>·</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  {d.nota && (
                    <div style={{ marginTop: 8, padding: "10px 12px", background: p.lin, borderRadius: 10, fontSize: 12, color: p.textLight, fontStyle: "italic", lineHeight: 1.5 }}>
                      💡 {d.nota}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Bebe() {
  const [onglet, setOnglet] = useState("croissance");
  const { bebe } = useBebeStore();

  const onglets = [
    { id: "croissance", label: "📈 Croissance" },
    { id: "vaccins", label: "💉 Vaccins" },
    { id: "developpement", label: "🌱 Éveil" },
  ];

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: p.lin }}>
      <Header />
      <div style={{ padding: "18px 18px 110px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: p.text, marginBottom: 16 }}>
          👶 {bebe?.prenom || "Bébé"}
        </div>

        {/* Onglets */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, background: p.linDark, borderRadius: 14, padding: 4 }}>
          {onglets.map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              style={{ flex: 1, padding: "9px 4px", borderRadius: 11, border: "none", background: onglet === o.id ? p.white : "transparent", color: onglet === o.id ? p.terracotta : p.textLight, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: onglet === o.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {o.label}
            </button>
          ))}
        </div>

        {onglet === "croissance" && <OngletCroissance bebe={bebe} />}
        {onglet === "vaccins" && <OngletVaccins bebe={bebe} />}
        {onglet === "developpement" && <OngletDeveloppement bebe={bebe} />}
      </div>
    </div>
  );
}
