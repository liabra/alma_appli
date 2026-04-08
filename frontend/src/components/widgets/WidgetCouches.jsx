import { useSessionStore } from "../../store/useSessionStore";

const p = { sauge: "#6B8F71", saugePale: "#C8DBC9", terracotta: "#C4714A", terracottaPale: "#F0D5C5", linDark: "#EDE0D0", lin: "#F5EDE3", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6" };

export default function WidgetCouches() {
  const { addCouche, supprimerDerniereCouche, getCouchesAujourdhui } = useSessionStore();
  const couches = getCouchesAujourdhui();
  const pipi  = couches.filter(c => c.type === "pipi").length;
  const selle = couches.filter(c => c.type === "selle").length;
  const mixte = couches.filter(c => c.type === "mixte").length;

  const dernier = couches.length > 0
    ? Math.round((Date.now() - couches[couches.length - 1].timestamp) / 60000)
    : null;

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.saugePale}`, boxShadow: "0 2px 12px rgba(107,143,113,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>🧷 Couches</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: p.textLight }}>aujourd'hui</span>
          {couches.length > 0 && (
            <button onClick={supprimerDerniereCouche}
              style={{ fontSize: 11, color: "#C04040", background: "#FFF0F0", border: "1px solid #F0C0C0", borderRadius: 8, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}>
              ↩ Annuler
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[["pipi","💧","#6B8F71",pipi],["selle","💩","#C4714A",selle],["mixte","🔄","#8B7BAB",mixte]].map(([type, emoji, color, count]) => (
          <button key={type} onClick={() => addCouche(type)}
            style={{ padding: "12px 6px", borderRadius: 12, border: `1.5px solid ${color}20`, background: `${color}12`, color, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 22 }}>{emoji}</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{count}</span>
            <span style={{ fontSize: 10, textTransform: "capitalize" }}>{type}</span>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 10, color: p.textLight, marginTop: 8, textAlign: "center" }}>
        {couches.length} couche{couches.length > 1 ? "s" : ""} · {selle} selle{selle > 1 ? "s" : ""}
        {dernier !== null && ` · dernière il y a ${dernier < 60 ? `${dernier} min` : `${Math.round(dernier/60)}h`}`}
      </div>
    </div>
  );
}
