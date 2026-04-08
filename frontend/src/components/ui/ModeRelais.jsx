import { useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";
import { useBebeStore } from "../../store/useBebeStore";

const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0",
  sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
  night: "#1E2A3A",
};

function depuisCombien(timestamp) {
  if (!timestamp) return "inconnu";
  const min = Math.round((Date.now() - timestamp) / 60000);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `il y a ${h}h${String(m).padStart(2,"0")}` : `il y a ${h}h`;
}

export default function ModeRelais({ nightMode = false }) {
  const [ouvert, setOuvert] = useState(false);
  const { getTeteesAujourdhui, getCouchesAujourdhui, sommeilEnCours, getPeriodeSommeilAujourdhui } = useSessionStore();
  const { getBebe } = useBebeStore();
  const bebe = getBebe();
  const prenom = bebe?.prenom || "Bébé";
  const e = bebe?.sexe === "fille" ? "e" : "";

  const tetees = getTeteesAujourdhui();
  const couches = getCouchesAujourdhui();
  const periodes = getPeriodeSommeilAujourdhui();

  const derniereTetee = tetees.length > 0 ? tetees[tetees.length - 1] : null;
  const derniereCouche = couches.length > 0 ? couches[couches.length - 1] : null;
  const sleeping = !!sommeilEnCours;

  const genererTexte = () => {
    const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    let txt = `🌿 Relais ${prenom} — ${heure}\n\n`;
    txt += `🤱 Dernière tétée : ${derniereTetee ? depuisCombien(derniereTetee.timestamp) : "non enregistrée"}\n`;
    txt += `🧷 Dernière couche : ${derniereCouche ? depuisCombien(derniereCouche.timestamp) : "non enregistrée"}\n`;
    txt += `🌙 Sommeil : ${sleeping ? `dort depuis ${depuisCombien(sommeilEnCours)}` : `éveillé${e} depuis ${periodes.length > 0 ? depuisCombien(periodes[periodes.length - 1]?.fin) : "un moment"}`}\n`;
    txt += `\nTotal auj. : ${tetees.length} tétées · ${couches.length} couches · ${periodes.length} siestes`;
    return txt;
  };

  const partager = () => {
    const texte = genererTexte();
    if (navigator.share) {
      navigator.share({ text: texte });
    } else {
      navigator.clipboard.writeText(texte);
      alert("Résumé copié dans le presse-papiers !");
    }
  };

  const bg = nightMode ? "#0A0800" : p.white;
  const textColor = nightMode ? "#FF8C35" : p.text;
  const subColor = nightMode ? "#8B5A00" : p.textLight;
  const cardBg = nightMode ? "#150C00" : p.lin;

  return (
    <div>
      <button onClick={() => setOuvert(!ouvert)}
        style={{ width: "100%", padding: "12px 20px", borderRadius: 16, background: nightMode ? "#0A1500" : p.saugePale, border: `1.5px solid ${nightMode ? "#1A2A00" : p.sauge}`, color: nightMode ? "#7DFF35" : p.sauge, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>👥</span>
        Mode relais
      </button>

      {ouvert && (
        <div style={{ background: bg, borderRadius: 20, padding: "18px", border: `1.5px solid ${nightMode ? "#1A2A00" : p.saugePale}`, marginTop: 8 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: textColor, marginBottom: 14 }}>
            👥 Résumé pour le relais
          </div>

          {[
            { icon: "🤱", label: "Dernière tétée", val: derniereTetee ? depuisCombien(derniereTetee.timestamp) : "non enregistrée", count: `${tetees.length} aujourd'hui` },
            { icon: "🧷", label: "Dernière couche", val: derniereCouche ? depuisCombien(derniereCouche.timestamp) : "non enregistrée", count: `${couches.length} aujourd'hui` },
            { icon: "🌙", label: "Sommeil", val: sleeping ? `dort (${depuisCombien(sommeilEnCours)})` : `éveillé${e}`, count: `${periodes.length} sieste${periodes.length > 1 ? "s" : ""} auj.` },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: cardBg, borderRadius: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: subColor, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: textColor }}>{item.val}</div>
              </div>
              <div style={{ fontSize: 11, color: subColor, textAlign: "right" }}>{item.count}</div>
            </div>
          ))}

          <button onClick={partager}
            style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 12, border: "none", background: nightMode ? "#1A2A00" : p.sauge, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span>📤</span> Envoyer / Copier
          </button>
        </div>
      )}
    </div>
  );
}
