import { useState, useEffect } from "react";
import { useSessionStore } from "../../store/useSessionStore";

const p = { sauge: "#6B8F71", saugePale: "#C8DBC9", terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5", linDark: "#EDE0D0", lin: "#F5EDE3", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6" };

const fmt = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function WidgetPleurs() {
  const pleursEnCours = useSessionStore((s) => s.pleursEnCours);
  useSessionStore((s) => s.pleurs); // abonnement : re-rend à l'ajout/suppression
  const startPleurs = useSessionStore((s) => s.startPleurs);
  const stopPleurs = useSessionStore((s) => s.stopPleurs);
  const annulerPleursEnCours = useSessionStore((s) => s.annulerPleursEnCours);
  const addPleursManuel = useSessionStore((s) => s.addPleursManuel);
  const supprimerDernierPleurs = useSessionStore((s) => s.supprimerDernierPleurs);
  const getPleursAujourdhui = useSessionStore((s) => s.getPleursAujourdhui);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (pleursEnCours == null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [pleursEnCours]);

  const pleursAuj = getPleursAujourdhui();
  const totalMin = Math.round(pleursAuj.reduce((a, pl) => a + ((pl.fin - pl.debut) / 60000), 0));

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.terracottaPale}`, boxShadow: "0 2px 12px rgba(196,113,74,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>😢 Pleurs</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: p.textLight }}>aujourd'hui</span>
          {pleursAuj.length > 0 && (
            <button onClick={supprimerDernierPleurs}
              style={{ fontSize: 11, color: "#C04040", background: "#FFF0F0", border: "1px solid #F0C0C0", borderRadius: 8, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}>
              ↩ Annuler
            </button>
          )}
        </div>
      </div>

      {pleursEnCours == null ? (
        <>
          <button onClick={startPleurs}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: p.terracottaL, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
            Bébé pleure — démarrer
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {[5, 15, 30].map((min) => (
              <button key={min} onClick={() => addPleursManuel(min)}
                style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: "transparent", color: p.textLight, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                ~{min} min
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 600, color: p.terracotta, lineHeight: 1, letterSpacing: "-1px" }}>
              {fmt(now - pleursEnCours)}
            </div>
            <div style={{ fontSize: 12, color: p.textLight, marginTop: 2 }}>épisode en cours</div>
          </div>
          <button onClick={stopPleurs}
            style={{ width: "100%", padding: "12px 0", borderRadius: 14, border: "none", background: p.sauge, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            C'est fini
          </button>
          <button onClick={annulerPleursEnCours}
            style={{ width: "100%", padding: "8px 0", marginTop: 6, background: "transparent", border: "none", color: p.textLight, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
            Annuler cet épisode
          </button>
        </>
      )}

      <div style={{ fontSize: 10, color: p.textLight, marginTop: 10, textAlign: "center" }}>
        {pleursAuj.length} épisode{pleursAuj.length > 1 ? "s" : ""} · total {totalMin} min aujourd'hui
      </div>
      <div style={{ fontSize: 10, color: p.textLight, marginTop: 6, textAlign: "center", fontStyle: "italic", lineHeight: 1.4 }}>
        Pleurer est le seul langage de bébé — noter aide à voir les rythmes.
      </div>
    </div>
  );
}
