import { useTimer } from "../../hooks/useTimer";
import { useSessionStore } from "../../store/useSessionStore";
import { useBebeStore } from "../../store/useBebeStore";
import { useEffect } from "react";

const p = { night: "#1E2A3A", saugePale: "#C8DBC9", sable: "#E8C9A0", textLight: "#7A6E66" };

export default function WidgetSommeil() {
  const { sommeilEnCours, startSommeil, stopSommeil, getTotalSommeilAujourdhui, getPeriodeSommeilAujourdhui } = useSessionStore();
  const { bebe, getEveilMaxMinutes } = useBebeStore();
  const sleeping = !!sommeilEnCours;

  // Prénom dynamique depuis le store
  const prenom = bebe?.prenom || "Bébé";
  const sexe = bebe?.sexe || "garcon";
  const eveille = sexe === "fille" ? "éveillée" : "éveillé";

  const sleepTimer = useTimer();
  const eveilTimer = useTimer();

  useEffect(() => {
    if (sleeping) { sleepTimer.start(); eveilTimer.reset(); }
    else { eveilTimer.start(); sleepTimer.reset(); }
  }, [sleeping]);

  const eveilMax = getEveilMaxMinutes();
  const eveilMinutes = Math.floor(eveilTimer.seconds / 60);
  const fenetreProche = !sleeping && eveilMinutes >= eveilMax - 10;

  const fenetreTexte = () => {
    if (sleeping) {
      const restant = Math.max(0, 90 - Math.floor(sleepTimer.seconds / 60));
      return `Prochain éveil dans ~${restant} min`;
    }
    if (eveilMinutes >= eveilMax + 5) return "⚠ Signes de fatigue à surveiller";
    if (eveilMinutes >= eveilMax - 10) return "Fenêtre de sommeil maintenant";
    return `Fenêtre de sommeil dans ~${eveilMax - eveilMinutes} min`;
  };

  const toggle = () => {
    if (sleeping) { stopSommeil(); }
    else { startSommeil(); }
  };

  const periodes = getPeriodeSommeilAujourdhui();
  const plusLong = periodes.length > 0
    ? Math.max(...periodes.map((p) => p.fin - p.debut))
    : 0;
  const fmtMs = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h${String(m).padStart(2,"0")}` : `${m} min`;
  };

  return (
    <div style={{ background: p.night, borderRadius: 20, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.04em" }}>🌙 Sommeil</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>total · {getTotalSommeilAujourdhui()}</span>
      </div>

      {/* Bouton 1 tap */}
      <button onClick={toggle} style={{ width: "100%", padding: "20px 0", borderRadius: 18, border: `2px solid ${sleeping ? "#7DD8A040" : "rgba(232,201,160,0.25)"}`, background: sleeping ? "linear-gradient(135deg,rgba(125,216,160,0.12),rgba(125,216,160,0.05))" : "linear-gradient(135deg,rgba(232,201,160,0.12),rgba(232,201,160,0.04))", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 30 }}>{sleeping ? "😴" : "👀"}</span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 600, color: sleeping ? "#7DD8A0" : "#E8C9A0" }}>
          {sleeping ? `${prenom} dort` : `${prenom} est ${eveille}`}
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
          {sleeping ? sleepTimer.fmt : eveilTimer.fmt}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
          appuyer pour {sleeping ? "noter le réveil" : "noter le dodo"}
        </span>
      </button>

      {/* Fenêtre de sommeil */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, background: fenetreProche ? "rgba(232,201,160,0.15)" : "rgba(255,255,255,0.05)", border: fenetreProche ? "1px solid rgba(232,201,160,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: fenetreProche ? "#E8C9A0" : "rgba(255,255,255,0.2)", flexShrink: 0, boxShadow: fenetreProche ? "0 0 6px rgba(232,201,160,0.6)" : "none" }} />
        <span style={{ fontSize: 12, color: fenetreProche ? "#E8C9A0" : "rgba(255,255,255,0.35)", fontWeight: fenetreProche ? 600 : 400 }}>
          {fenetreTexte()}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
        {[
          [periodes.length, "périodes"],
          [plusLong > 0 ? fmtMs(plusLong) : "—", "plus long"],
          [eveilMax + " min", "éveil max"],
        ].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{v}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
