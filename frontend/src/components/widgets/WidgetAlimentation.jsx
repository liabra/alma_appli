import { useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useSessionStore } from "../../store/useSessionStore";
import { SIGNAUX_ALLAITEMENT, ALERTES_ALLAITEMENT } from "../../data/allaitement";

const p = { terracotta: "#C4714A", terracottaPale: "#F0D5C5", lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6" };

export default function WidgetAlimentation() {
  const { modeAlimentation, setModeAlimentation, getTeteesAujourdhui, addTetee } = useSessionStore();
  const timer = useTimer();
  const [activeSein, setActiveSein] = useState("gauche");
  const [ml, setMl] = useState("90");
  const [signauxActifs, setSignauxActifs] = useState([]);

  const teteesAujourdhui = getTeteesAujourdhui();
  const derniereAlerte = signauxActifs.length > 0 ? ALERTES_ALLAITEMENT[signauxActifs[signauxActifs.length - 1]] : null;

  const toggleSignal = (id) =>
    setSignauxActifs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const enregistrerTetee = () => {
    addTetee({ debut: Date.now() - timer.seconds * 1000, fin: Date.now(), sein: activeSein, signaux: signauxActifs, timestamp: Date.now() });
    timer.reset();
    setSignauxActifs([]);
  };

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.terracottaPale}`, boxShadow: "0 2px 12px rgba(196,113,74,0.08)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>
          {modeAlimentation === "allait" ? "🤱" : modeAlimentation === "biberon" ? "🍼" : "🤱🍼"} Alimentation
        </div>
        <span style={{ fontSize: 11, color: p.textLight }}>{teteesAujourdhui.length} fois auj.</span>
      </div>

      {/* Sélecteur de mode */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["allait","🤱 Allait."],["biberon","🍼 Biberon"],["mixte","↔ Mixte"]].map(([m, label]) => (
          <button key={m} onClick={() => setModeAlimentation(m)}
            style={{ flex: 1, padding: "7px 4px", borderRadius: 10, border: `1.5px solid ${modeAlimentation === m ? p.terracotta : p.linDark}`, background: modeAlimentation === m ? p.terracottaPale : "transparent", color: modeAlimentation === m ? p.terracotta : p.textLight, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Mode allaitement */}
      {(modeAlimentation === "allait" || modeAlimentation === "mixte") && (
        <>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 600, color: p.terracotta, lineHeight: 1, letterSpacing: "-1px" }}>{timer.fmt}</div>
            <div style={{ fontSize: 12, color: p.textLight, marginTop: 2 }}>
              {timer.running ? `sein ${activeSein} en cours` : "prête à téter ?"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {["gauche","droit"].map((sein) => (
              <button key={sein} onClick={() => setActiveSein(sein)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${activeSein === sein ? p.terracotta : p.linDark}`, background: activeSein === sein ? p.terracottaPale : "transparent", color: activeSein === sein ? p.terracotta : p.textLight, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {sein === "gauche" ? "← Gauche" : "Droit →"}
              </button>
            ))}
          </div>
          <button onClick={timer.running ? enregistrerTetee : timer.start}
            style={{ width: "100%", padding: "12px 0", borderRadius: 14, border: "none", background: timer.running ? p.sauge : p.terracotta, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
            {timer.running ? "⏹ Terminer la tétée" : "▶ Démarrer"}
          </button>

          {/* Signaux */}
          <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, marginBottom: 6 }}>Un souci pendant la tétée ?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SIGNAUX_ALLAITEMENT.map((sig) => (
              <button key={sig.id} onClick={() => toggleSignal(sig.id)}
                style={{ padding: "5px 10px", borderRadius: 20, border: `1.5px solid ${signauxActifs.includes(sig.id) ? p.terracotta : p.linDark}`, background: signauxActifs.includes(sig.id) ? p.terracottaPale : "transparent", fontSize: 11, fontWeight: 600, color: signauxActifs.includes(sig.id) ? p.terracotta : p.textLight, cursor: "pointer" }}>
                {sig.label}
              </button>
            ))}
          </div>

          {/* Alerte contextuelle */}
          {derniereAlerte && (
            <div style={{ marginTop: 12, borderRadius: 14, padding: "12px 14px", background: derniereAlerte.urgence ? "#FFF0F0" : "#FFF8F0", border: `1.5px solid ${derniereAlerte.urgence ? "#F0A0A0" : "#F0C090"}`, display: "flex", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{derniereAlerte.urgence ? "⚠️" : "💡"}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: derniereAlerte.urgence ? "#A00000" : "#A0520A", marginBottom: 3 }}>{derniereAlerte.titre}</div>
                <div style={{ fontSize: 12, color: "#7A4A1A", lineHeight: 1.5 }}>{derniereAlerte.texte}</div>
                <a href={derniereAlerte.lien} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, fontWeight: 700, color: p.terracotta, marginTop: 6, display: "block" }}>
                  {derniereAlerte.lienLabel}
                </a>
                <div style={{ fontSize: 10, color: "#B07040", marginTop: 4, fontStyle: "italic" }}>
                  Ceci n'est pas un avis médical · consulte une IBCLC ou LLL France en cas de doute.
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mode biberon */}
      {modeAlimentation === "biberon" && (
        <>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <input type="number" value={ml} onChange={(e) => setMl(e.target.value)}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${p.linDark}`, background: p.lin, fontSize: 28, fontWeight: 700, color: p.terracotta, fontFamily: "'Cormorant Garamond', serif", textAlign: "center", outline: "none" }} />
            <span style={{ fontSize: 14, color: p.textLight, fontWeight: 600 }}>ml</span>
          </div>
          <button onClick={() => addTetee({ ml: parseInt(ml), timestamp: Date.now() })}
            style={{ width: "100%", padding: "12px 0", borderRadius: 14, border: "none", background: p.terracotta, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            ✓ Enregistrer ce biberon
          </button>
        </>
      )}

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "10px 12px", background: p.lin, borderRadius: 10 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: p.text }}>{teteesAujourdhui.length}</div>
          <div style={{ fontSize: 10, color: p.textLight, marginTop: 1 }}>{modeAlimentation === "biberon" ? "biberons" : "tétées"} auj.</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: p.text }}>
            {modeAlimentation === "biberon"
              ? `${teteesAujourdhui.reduce((a, t) => a + (t.ml || 0), 0)} ml`
              : teteesAujourdhui.length > 0 ? `${Math.round(teteesAujourdhui.reduce((a, t) => a + ((t.fin - t.debut) / 60000 || 0), 0) / teteesAujourdhui.length)} min` : "—"}
          </div>
          <div style={{ fontSize: 10, color: p.textLight, marginTop: 1 }}>{modeAlimentation === "biberon" ? "total" : "durée moy."}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: p.text }}>
            {activeSein === "gauche" ? "↔ G" : "↔ D"}
          </div>
          <div style={{ fontSize: 10, color: p.textLight, marginTop: 1 }}>dernier sein</div>
        </div>
      </div>
    </div>
  );
}
