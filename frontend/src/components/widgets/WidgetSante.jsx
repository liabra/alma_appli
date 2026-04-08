import { useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";
import { useNavigate } from "react-router-dom";

const p = { terracotta: "#C4714A", terracottaPale: "#F0D5C5", linDark: "#EDE0D0", lin: "#F5EDE3", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", sauge: "#6B8F71", saugePale: "#C8DBC9" };

export default function WidgetSante() {
  const { addTemperature, getDerniereTemperature } = useSessionStore();
  const [temp, setTemp] = useState("");
  const derniere = getDerniereTemperature();
  const navigate = useNavigate();

  const enregistrer = () => {
    const val = parseFloat(temp);
    if (!temp || isNaN(val) || val < 35 || val > 43) return;
    addTemperature(val);
    setTemp("");
  };

  const handleKey = (e) => { if (e.key === "Enter") enregistrer(); };

  const tempColor = derniere
    ? derniere.valeur >= 38.5 ? "#C04040"
      : derniere.valeur >= 37.5 ? "#C07020"
      : "#6B8F71"
    : p.terracotta;

  const alerteMsg = derniere
    ? derniere.valeur >= 39 ? "⚠ Fièvre élevée — médecin le jour même"
      : derniere.valeur >= 38.5 ? "⚠ Fièvre — surveille de près"
      : derniere.valeur >= 38 ? "🌡 Légère fièvre — surveille"
      : null
    : null;

  const formatHeure = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return d.toDateString() === today.toDateString()
      ? `aujourd'hui · ${heure}`
      : `${d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} · ${heure}`;
  };

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "16px 20px", border: `1px solid ${p.linDark}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: alerteMsg ? 10 : 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>🌡 Température</div>
          <div style={{ fontSize: 12, color: p.textLight, marginTop: 2 }}>
            {derniere ? `Dernière mesure · ${formatHeure(derniere.timestamp)}` : "Aucune mesure enregistrée"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {derniere && (
            <div style={{ background: p.terracottaPale, color: tempColor, borderRadius: 10, padding: "6px 12px", fontSize: 16, fontWeight: 700 }}>
              {derniere.valeur.toFixed(1)}°
            </div>
          )}
          <div style={{ display: "flex", gap: 4 }}>
            <input
              type="number" step="0.1" min="35" max="43"
              value={temp} onChange={e => setTemp(e.target.value)} onKeyDown={handleKey}
              placeholder="°C"
              style={{ width: 56, padding: "6px 8px", borderRadius: 8, border: `1.5px solid ${p.linDark}`, fontSize: 13, textAlign: "center", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
            <button onClick={enregistrer}
              style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: p.terracotta, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓</button>
          </div>
        </div>
      </div>

      {/* Alerte fièvre */}
      {alerteMsg && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: derniere?.valeur >= 38.5 ? "#FFF0F0" : "#FFFBF0", borderRadius: 10, border: `1px solid ${derniere?.valeur >= 38.5 ? "#F0C0C0" : "#F0D080"}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: tempColor }}>{alerteMsg}</div>
          <button onClick={() => navigate("/alertes")}
            style={{ fontSize: 11, fontWeight: 700, color: tempColor, background: "transparent", border: `1px solid ${tempColor}`, borderRadius: 8, padding: "3px 8px", cursor: "pointer", flexShrink: 0, marginLeft: 8 }}>
            Guide →
          </button>
        </div>
      )}

      {/* Raccourci vers la section alertes */}
      <button onClick={() => navigate("/alertes")}
        style={{ width: "100%", marginTop: 10, padding: "8px", borderRadius: 10, border: `1px solid ${p.saugePale}`, background: "transparent", color: p.sauge, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        🩺 Quand consulter un médecin ?
      </button>
    </div>
  );
}
