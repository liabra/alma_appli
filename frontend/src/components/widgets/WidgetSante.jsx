import { useState } from "react";

const p = { terracotta: "#C4714A", terracottaPale: "#F0D5C5", linDark: "#EDE0D0", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6" };

export default function WidgetSante() {
  const [temp, setTemp] = useState("");
  const [dernierTemp, setDernierTemp] = useState(null);

  const enregistrer = () => {
    if (temp) { setDernierTemp({ valeur: temp, heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }); setTemp(""); }
  };

  const tempNum = dernierTemp ? parseFloat(dernierTemp.valeur) : null;
  const tempColor = tempNum >= 38 ? "#C04040" : tempNum >= 37.5 ? "#C07020" : "#C4714A";

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "16px 20px", border: `1px solid ${p.linDark}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>🌡 Température</div>
        <div style={{ fontSize: 12, color: p.textLight, marginTop: 2 }}>
          {dernierTemp ? `Dernière mesure · ${dernierTemp.heure}` : "Aucune mesure aujourd'hui"}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {dernierTemp && (
          <div style={{ background: p.terracottaPale, color: tempColor, borderRadius: 10, padding: "6px 12px", fontSize: 16, fontWeight: 700 }}>
            {dernierTemp.valeur}°
          </div>
        )}
        <div style={{ display: "flex", gap: 4 }}>
          <input type="number" step="0.1" min="35" max="42" value={temp} onChange={(e) => setTemp(e.target.value)}
            placeholder="°C" style={{ width: 56, padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${p.linDark}`, fontSize: 13, textAlign: "center", outline: "none" }} />
          <button onClick={enregistrer} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: p.terracotta, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓</button>
        </div>
      </div>
    </div>
  );
}
