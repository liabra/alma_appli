import { useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";

const p = { terracotta: "#C4714A", terracottaPale: "#F0D5C5", linDark: "#EDE0D0", lin: "#F5EDE3", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6" };

export default function WidgetSante() {
  const { addTemperature, getDerniereTemperature } = useSessionStore();
  const [temp, setTemp] = useState("");
  const derniere = getDerniereTemperature();

  const enregistrer = () => {
    if (!temp || isNaN(parseFloat(temp))) return;
    addTemperature(parseFloat(temp));
    setTemp("");
  };

  const tempColor = derniere
    ? (derniere.valeur >= 38.5 ? "#C04040" : derniere.valeur >= 37.5 ? "#C07020" : "#6B8F71")
    : p.terracotta;

  const formatHeure = (ts) => new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return `aujourd'hui · ${formatHeure(ts)}`;
    return `${d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} · ${formatHeure(ts)}`;
  };

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "16px 20px", border: `1px solid ${p.linDark}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>🌡 Température</div>
          <div style={{ fontSize: 12, color: p.textLight, marginTop: 2 }}>
            {derniere ? `Dernière mesure · ${formatDate(derniere.timestamp)}` : "Aucune mesure enregistrée"}
          </div>
          {derniere && derniere.valeur >= 38 && (
            <div style={{ fontSize: 11, color: "#C04040", fontWeight: 600, marginTop: 2 }}>
              {derniere.valeur >= 39 ? "⚠ Fièvre élevée — consulte" : derniere.valeur >= 38 ? "⚠ Fièvre — surveille" : ""}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {derniere && (
            <div style={{ background: p.terracottaPale, color: tempColor, borderRadius: 10, padding: "6px 12px", fontSize: 16, fontWeight: 700 }}>
              {derniere.valeur.toFixed(1)}°
            </div>
          )}
          <div style={{ display: "flex", gap: 4 }}>
            <input type="number" step="0.1" min="35" max="42" value={temp}
              onChange={e => setTemp(e.target.value)}
              placeholder="°C"
              style={{ width: 56, padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${p.linDark}`, fontSize: 13, textAlign: "center", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
            <button onClick={enregistrer}
              style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: p.terracotta, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓</button>
          </div>
        </div>
      </div>
    </div>
  );
}
