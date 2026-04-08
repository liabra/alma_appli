import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useBebeStore } from "../store/useBebeStore";

const STEPS = ["bienvenue", "prenom", "naissance", "alimentation", "pret"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [modeAlimentation, setModeAlimentation] = useState("allait");

  const { setIsNewUser } = useUserStore();
  const { setBebe } = useBebeStore();

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  const terminer = () => {
    setBebe({ prenom, dateNaissance, modeAlimentation });
    setIsNewUser(false);
  };

  const p = { terracotta: "#C4714A", terracottaPale: "#F0D5C5", lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6" };

  const screen = {
    minHeight: "100vh", background: p.lin, display: "flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "40px 28px", maxWidth: 390, margin: "0 auto",
    fontFamily: "'DM Sans', sans-serif",
  };

  const title = { fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: p.terracotta, marginBottom: 12, textAlign: "center" };
  const sub = { fontSize: 15, color: p.textLight, textAlign: "center", lineHeight: 1.6, marginBottom: 32 };
  const btn = { width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: p.terracotta, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 };
  const input = { width: "100%", padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: p.text, outline: "none", marginBottom: 16, textAlign: "center" };
  const modeBtn = (active) => ({ flex: 1, padding: "14px 8px", borderRadius: 14, border: `1.5px solid ${active ? p.terracotta : p.linDark}`, background: active ? p.terracottaPale : "transparent", color: active ? p.terracotta : p.textLight, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center" });

  return (
    <div style={screen}>
      {/* Indicateur de progression */}
      <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? p.terracotta : p.linDark, transition: "all 0.3s" }} />
        ))}
      </div>

      {/* Étape 0 — Bienvenue */}
      {step === 0 && (
        <>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
          <div style={title}>Bienvenue sur Alma</div>
          <div style={sub}>
            Ton espace doux pour les premières semaines — allaitement, bébé, post-partum.
            Tout ce dont tu as besoin, à portée d'un tap.
          </div>
          <div style={{ fontSize: 12, color: p.textLight, textAlign: "center", marginBottom: 24, fontStyle: "italic", lineHeight: 1.6 }}>
            Alma ne collecte aucune donnée personnelle identifiable.<br />
            Compte anonyme · Données stockées sur ton appareil.<br />
            Aucune publicité. Jamais.
          </div>
          <button style={btn} onClick={next}>Commencer 🌸</button>
        </>
      )}

      {/* Étape 1 — Prénom bébé */}
      {step === 1 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👶</div>
          <div style={title}>Comment s'appelle ton bébé ?</div>
          <div style={sub}>Ou son surnom, son prénom en cours, ou juste "bébé" si tu n'as pas encore décidé.</div>
          <input style={input} type="text" placeholder="Prénom..." value={prenom}
            onChange={(e) => setPrenom(e.target.value)} autoFocus />
          <button style={{ ...btn, opacity: prenom.trim() ? 1 : 0.5 }}
            onClick={() => prenom.trim() && next()}>
            Continuer
          </button>
        </>
      )}

      {/* Étape 2 — Date de naissance */}
      {step === 2 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗓</div>
          <div style={title}>Quand est né·e {prenom} ?</div>
          <div style={sub}>Pour adapter les conseils à son âge exact.</div>
          <input style={{ ...input, fontSize: 16 }} type="date"
            value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)}
            max={new Date().toISOString().split("T")[0]} />
          <button style={{ ...btn, opacity: dateNaissance ? 1 : 0.5 }}
            onClick={() => dateNaissance && next()}>
            Continuer
          </button>
        </>
      )}

      {/* Étape 3 — Mode alimentation */}
      {step === 3 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤱</div>
          <div style={title}>Comment nourris-tu {prenom} ?</div>
          <div style={{ ...sub, marginBottom: 20 }}>
            Tu pourras changer ça à tout moment. Tous les choix sont respectés ici.
          </div>
          <div style={{ display: "flex", gap: 8, width: "100%", marginBottom: 24 }}>
            {[
              { id: "allait", label: "🤱", desc: "Allaitement" },
              { id: "biberon", label: "🍼", desc: "Biberon" },
              { id: "mixte", label: "↔", desc: "Mixte" },
            ].map((m) => (
              <button key={m.id} style={modeBtn(modeAlimentation === m.id)}
                onClick={() => setModeAlimentation(m.id)}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{m.label}</div>
                <div>{m.desc}</div>
              </button>
            ))}
          </div>
          <button style={btn} onClick={next}>Continuer</button>
        </>
      )}

      {/* Étape 4 — Prête */}
      {step === 4 && (
        <>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
          <div style={title}>Tout est prêt !</div>
          <div style={sub}>
            Alma est configurée pour {prenom}. Tu peux personnaliser ton dashboard à tout moment en ajoutant ou retirant des widgets.
          </div>
          <div style={{ width: "100%", padding: "16px", background: p.white, borderRadius: 16, marginBottom: 24, border: `1px solid ${p.linDark}` }}>
            <div style={{ fontSize: 13, color: p.textLight, marginBottom: 8, fontWeight: 600 }}>Un rappel important</div>
            <div style={{ fontSize: 12, color: p.textLight, lineHeight: 1.6 }}>
              Alma est un outil d'aide, pas un avis médical. Pour toute inquiétude concernant ta santé ou celle de {prenom}, consulte toujours un professionnel de santé.
            </div>
          </div>
          <button style={btn} onClick={terminer}>Ouvrir Alma 🌿</button>
        </>
      )}
    </div>
  );
}
